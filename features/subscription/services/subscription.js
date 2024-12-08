const axios = require("axios");
const SubscriptionRepository = require("../repositories/subscription");

const PAYMENT_STATUS = {
  PENDING: "PENDING",
  SUCCESS: "SUCCESS",
  FAILED: "FAILED",
};

const BOOKING_STATUS = {
  ACTIVE: "ACTIVE",
  PENDING: "PENDING",
};

class SubscriptionService {
  constructor() {
    this.midtransUrl = process.env.MIDTRANS_URL;
    this.serverKey = process.env.MIDTRANS_SERVER_KEY;

    if (!this.serverKey || !this.midtransUrl) {
      throw new Error("Midtrans configuration is missing.");
    }
  }

  async createBooking(userId, subscriptionId) {
    if (!userId || !subscriptionId) {
      throw new Error("User ID dan Subscription ID harus disediakan.");
    }

    // Cari data subscription
    const subscription = await SubscriptionRepository.findSubscriptionById(
      subscriptionId
    );
    if (!subscription) {
      throw new Error("Subscription tidak ditemukan.");
    }

    // Buat booking
    const booking = await SubscriptionRepository.createBooking({
      user_id: userId,
      subscription_id: subscriptionId,
      start_date: new Date(),
      end_date: new Date(
        new Date().setDate(new Date().getDate() + subscription.duration)
      ),
      status: BOOKING_STATUS.PENDING,
    });

    // Siapkan payload untuk Midtrans
    const payload = {
      transaction_details: {
        order_id: `ORDER-${booking.id}-${Date.now()}`,
        gross_amount: subscription.price,
      },
      customer_details: {
        user_id: userId,
        subscription_plan: subscription.plan_name,
      },
    };

    // Buat header autentikasi untuk Midtrans
    const authString = Buffer.from(`${this.serverKey}:`).toString("base64");
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Basic ${authString}`,
    };

    // Kirim permintaan ke Midtrans
    let transaction;
    try {
      const response = await axios.post(this.midtransUrl, payload, { headers });
      transaction = response.data;
    } catch (error) {
      console.error("Midtrans Error:", error.response?.data || error.message);
      throw new Error("Gagal membuat transaksi dengan Midtrans.");
    }

    // Simpan data pembayaran
    await SubscriptionRepository.createPayment({
      user_id: userId,
      booking_id: booking.id,
      transaction_id: transaction.token,
      amount: subscription.price,
      status: PAYMENT_STATUS.PENDING,
    });

    return { booking, payment: transaction };
  }

  async handleMidtransNotification(notification) {
    try {
      const { order_id, transaction_status } = notification;

      if (!order_id || !transaction_status) {
        throw new Error("Notifikasi dari Midtrans tidak lengkap.");
      }

      // Ambil data pembayaran berdasarkan `order_id`
      const payment = await SubscriptionRepository.findPaymentByTransactionId(
        order_id
      );
      if (!payment) {
        throw new Error(
          `Pembayaran dengan order_id ${order_id} tidak ditemukan.`
        );
      }

      // Tentukan status pembayaran berdasarkan `transaction_status`
      let newPaymentStatus = PAYMENT_STATUS.PENDING;
      if (["capture", "settlement"].includes(transaction_status)) {
        newPaymentStatus = PAYMENT_STATUS.SUCCESS;
      } else if (["deny", "cancel", "expire"].includes(transaction_status)) {
        newPaymentStatus = PAYMENT_STATUS.FAILED;
      }

      // Perbarui status pembayaran
      await SubscriptionRepository.updatePaymentStatus(
        payment.id,
        newPaymentStatus
      );

      // Jika pembayaran berhasil, perbarui status booking
      if (newPaymentStatus === PAYMENT_STATUS.SUCCESS) {
        await SubscriptionRepository.updateBookingStatus(
          payment.booking_id,
          BOOKING_STATUS.ACTIVE
        );
      }

      return { paymentStatus: newPaymentStatus };
    } catch (error) {
      console.error("Midtrans Notification Error:", {
        message: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }
}

module.exports = new SubscriptionService();

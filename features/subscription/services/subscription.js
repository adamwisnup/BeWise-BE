const axios = require("axios");
const SubscriptionRepository = require("../repositories/subscription");
const UserRepository = require("../../users/repositories/user");
const crypto = require("crypto");

class SubscriptionService {
  constructor() {
    this.midtransUrl = process.env.MIDTRANS_URL;
    this.serverKey = process.env.MIDTRANS_SERVER_KEY;

    if (!this.serverKey || !this.midtransUrl) {
      throw new Error("Midtrans configuration is missing.");
    }
  }

  async createBooking(userId, subscriptionId) {
    const subscription = await SubscriptionRepository.findSubscriptionById(
      subscriptionId
    );
    if (!subscription) {
      throw new Error("Subscription tidak ditemukan.");
    }

    const user = await UserRepository.findUserById(userId);
    if (!user) {
      throw new Error("Pengguna tidak ditemukan.");
    }

    const booking = await SubscriptionRepository.createBooking({
      user_id: userId,
      subscription_id: subscriptionId,
      start_date: new Date(),
      end_date: new Date(
        new Date().setDate(new Date().getDate() + subscription.duration)
      ),
      status: "PENDING",
    });

    const order_id = `ORDER-${booking.id}-${Date.now()}`;
    const payload = {
      transaction_details: {
        order_id: order_id,
        gross_amount: subscription.price,
      },
      customer_details: {
        user_id: userId,
        subscription_plan: subscription.plan_name,
        email: user.email,
      },
    };

    const authString = Buffer.from(`${this.serverKey}:`).toString("base64");
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Basic ${authString}`,
    };

    let transaction;
    try {
      const response = await axios.post(this.midtransUrl, payload, { headers });
      transaction = response.data;
    } catch (error) {
      console.error("Midtrans Error:", error.response?.data || error.message);
      throw new Error("Gagal membuat transaksi dengan Midtrans.");
    }

    await SubscriptionRepository.createPayment({
      user_id: userId,
      booking_id: booking.id,
      // transaction_id: transaction.token,
      transaction_id: order_id,
      amount: subscription.price,
      status: "PENDING",
    });

    return { booking, payment: transaction };
  }

  // async handleMidtransNotification(notification) {
  //   try {
  //     const { order_id, transaction_status } = notification;

  //     const payment = await SubscriptionRepository.findPaymentByTransactionId(
  //       order_id
  //     );
  //     if (!payment) {
  //       throw new Error(
  //         `Pembayaran dengan order_id ${order_id} tidak ditemukan.`
  //       );
  //     }

  //     let newPaymentStatus = "PENDING";
  //     if (
  //       transaction_status === "capture" ||
  //       transaction_status === "settlement"
  //     ) {
  //       newPaymentStatus = "SUCCESS";
  //     } else if (["deny", "cancel", "expire"].includes(transaction_status)) {
  //       newPaymentStatus = "FAILED";
  //     }

  //     await SubscriptionRepository.updatePaymentStatus(
  //       payment.id,
  //       newPaymentStatus
  //     );

  //     if (newPaymentStatus === "SUCCESS") {
  //       await SubscriptionRepository.updateBookingStatus(
  //         payment.booking_id,
  //         "ACTIVE"
  //       );
  //     }

  //     return { paymentStatus: newPaymentStatus };
  //   } catch (error) {
  //     console.error("Midtrans Notification Error:", error.message);
  //     throw error;
  //   }
  // }

  async handleMidtransNotification(notification) {
    try {
      console.log("Notifikasi Midtrans diterima:", notification);

      const { order_id, transaction_status, gross_amount, signature_key } =
        notification;

      // Validasi Signature Key dengan gross_amount
      // const dataToHash = `${order_id}${transaction_status}${gross_amount}${this.serverKey}`;
      // console.log("order_id", order_id);
      // console.log("transaction_status", transaction_status);
      // console.log("gross_amount", gross_amount);
      // console.log("server_key", this.serverKey);
      // console.log("String untuk hashing:", dataToHash);

      // const expectedSignatureKey = crypto
      //   .createHash("sha512")
      //   .update(dataToHash)
      //   .digest("hex");

      // console.log("Signature key yang diterima:", signature_key);
      // console.log("Signature key yang diharapkan:", expectedSignatureKey);

      // if (signature_key !== expectedSignatureKey) {
      //   console.error("Signature key tidak valid. Proses dihentikan.");
      //   throw new Error("Signature key tidak valid.");
      // }

      // Ekstrak booking_id dari order_id
      console.log("Order ID:", order_id);
      const [_, bookingId] = order_id.split("-");
      console.log("Booking ID:", bookingId);

      // Cek data pembayaran berdasarkan order_id
      const payment = await SubscriptionRepository.findPaymentByTransactionId(
        order_id
      );
      if (!payment) {
        console.error(
          `Pembayaran dengan order_id ${order_id} tidak ditemukan.`
        );
        throw new Error(
          `Pembayaran dengan order_id ${order_id} tidak ditemukan.`
        );
      }
      console.log("Data pembayaran ditemukan:", payment);

      // Pemetaan Status
      console.log("Status transaksi:", transaction_status);
      console.log("Gross Amount:", gross_amount);

      let newPaymentStatus = "PENDING";
      if (
        transaction_status === "capture" ||
        transaction_status === "settlement"
      ) {
        newPaymentStatus = "SUCCESS";
      } else if (
        transaction_status === "deny" ||
        transaction_status === "cancel" ||
        transaction_status === "expire"
      ) {
        newPaymentStatus = "FAILED";
      }
      console.log("Status pembayaran baru:", newPaymentStatus);

      // Update Status Pembayaran
      console.log("Memperbarui status pembayaran di database...");
      await SubscriptionRepository.updatePaymentStatus(
        payment.id,
        newPaymentStatus
      );
      console.log("Status pembayaran berhasil diperbarui.");

      // Update Status Booking jika Pembayaran Berhasil
      if (newPaymentStatus === "SUCCESS") {
        console.log("Memperbarui status booking menjadi ACTIVE...");
        await SubscriptionRepository.updateBookingStatus(
          payment.booking_id,
          "ACTIVE"
        );
        console.log("Status booking berhasil diperbarui.");
      }

      return { paymentStatus: newPaymentStatus };
    } catch (error) {
      console.error("Midtrans Notification Error:", error.message);
      throw error;
    }
  }

  async checkUserSubscription(userId) {
    const activeBooking =
      await SubscriptionRepository.findActiveSubscriptionByUserId(userId);

    if (!activeBooking) {
      return { isActive: false };
    }

    return {
      isActive: true,
      planName: activeBooking.subscription.plan_name,
      validUntil: activeBooking.end_date,
    };
  }
}

module.exports = new SubscriptionService();

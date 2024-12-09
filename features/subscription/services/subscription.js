const axios = require("axios");
const SubscriptionRepository = require("../repositories/subscription");

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

    const booking = await SubscriptionRepository.createBooking({
      user_id: userId,
      subscription_id: subscriptionId,
      start_date: new Date(),
      end_date: new Date(
        new Date().setDate(new Date().getDate() + subscription.duration)
      ),
      status: "PENDING",
    });

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
      transaction_id: transaction.token,
      amount: subscription.price,
      status: "PENDING",
    });

    return { booking, payment: transaction };
  }

  async handleMidtransNotification(notification) {
    try {
      const { order_id, transaction_status } = notification;

      const payment = await SubscriptionRepository.findPaymentByTransactionId(
        order_id
      );
      if (!payment) {
        throw new Error(
          `Pembayaran dengan order_id ${order_id} tidak ditemukan.`
        );
      }

      let newPaymentStatus = "PENDING";
      if (
        transaction_status === "capture" ||
        transaction_status === "settlement"
      ) {
        newPaymentStatus = "SUCCESS";
      } else if (["deny", "cancel", "expire"].includes(transaction_status)) {
        newPaymentStatus = "FAILED";
      }

      await SubscriptionRepository.updatePaymentStatus(
        payment.id,
        newPaymentStatus
      );

      if (newPaymentStatus === "SUCCESS") {
        await SubscriptionRepository.updateBookingStatus(
          payment.booking_id,
          "ACTIVE"
        );
      }

      return { paymentStatus: newPaymentStatus };
    } catch (error) {
      console.error("Midtrans Notification Error:", error.message);
      throw error;
    }
  }
}

module.exports = new SubscriptionService();

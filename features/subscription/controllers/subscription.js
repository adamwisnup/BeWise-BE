const SubscriptionService = require("../services/subscription");

class SubscriptionController {
  async createBooking(req, res) {
    try {
      const { subscriptionId } = req.body;
      const userId = req.user.userId;

      if (!subscriptionId) {
        return res.status(400).json({
          status: false,
          message: "ID subscription harus diisi.",
        });
      }

      const bookingData = await SubscriptionService.createBooking(
        userId,
        subscriptionId
      );

      res.status(200).json({
        status: true,
        message: "Booking berhasil dibuat.",
        data: bookingData,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: false,
        message: error.message || "Terjadi kesalahan.",
      });
    }
  }

  async handleMidtransNotification(req, res) {
    try {
      const notification = req.body;

      const result = await SubscriptionService.handleMidtransNotification(
        notification
      );

      return res.status(200).json({
        message: "Notifikasi berhasil diproses.",
        status: result.paymentStatus,
      });
    } catch (error) {
      console.error("Midtrans Notification Error:", error.message);
      return res.status(500).json({
        message: "Gagal memproses notifikasi.",
        error: error.message,
      });
    }
  }
}

module.exports = new SubscriptionController();

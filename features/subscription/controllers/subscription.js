const SubscriptionService = require("../services/subscription");
const crypto = require("crypto");

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

      // Validasi signature key (opsional untuk keamanan tambahan)
      const serverKey = process.env.MIDTRANS_SERVER_KEY;
      const hashString = `${notification.order_id}${notification.status_code}${notification.gross_amount}${serverKey}`;
      const generatedKey = crypto
        .createHash("sha512")
        .update(hashString)
        .digest("hex");

      if (notification.signature_key !== generatedKey) {
        return res.status(403).json({ message: "Signature key tidak valid." });
      }

      // Proses notifikasi
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

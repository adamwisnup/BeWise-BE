const SubscriptionService = require("../services/subscription");
const SubscriptionRepository = require("../repositories/subscription");

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

  // // In your subscription controller
  // async createBooking(req, res) {
  //   try {
  //     const { subscriptionId } = req.body;
  //     const userId = req.user.userId;

  //     if (!subscriptionId) {
  //       return res.status(400).json({
  //         status: false,
  //         message: "ID subscription harus diisi.",
  //       });
  //     }

  //     // Create the booking and payment URL logic
  //     const bookingData = await SubscriptionService.createBooking(
  //       userId,
  //       subscriptionId
  //     );

  //     // Check if paymentUrl exists and pass it to the EJS view
  //     const paymentUrl = bookingData.payment?.redirect_url || null;

  //     res.status(200).render("booking", {
  //       status: true,
  //       message: "Booking berhasil dibuat.",
  //       subscriptions: await SubscriptionService.getAllSubscriptions(), // Pass available subscriptions to the view
  //       paymentUrl: paymentUrl, // Ensure paymentUrl is passed
  //     });
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({
  //       status: false,
  //       message: error.message || "Terjadi kesalahan.",
  //     });
  //   }
  // }

  // // Fungsi untuk mendapatkan data langganan
  // async getSubscriptions(req, res) {
  //   try {
  //     const subscriptions = await SubscriptionRepository.findAllSubscriptions();
  //     res.render("booking.ejs", { subscriptions, layout: false });
  //   } catch (error) {
  //     console.error("Error fetching subscriptions:", error.message);
  //     res.status(500).send("Terjadi kesalahan.");
  //   }
  // }

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

const prisma = require("../configs/config");

const checkSubscription = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const currentDate = new Date();
    const startOfDay = new Date(currentDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(currentDate.setHours(23, 59, 59, 999));

    const activeSubscription = await prisma.booking.findFirst({
      where: {
        user_id: userId,
        status: "ACTIVE",
        end_date: {
          gte: new Date(),
        },
      },
    });

    if (activeSubscription) {
      return next();
    }

    const dailyScanCount = await prisma.history.count({
      where: {
        user_id: userId,
        created_at: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    if (dailyScanCount >= 5) {
      return res.status(403).json({
        status: false,
        message:
          "Anda telah mencapai batas scan produk harian. Silakan berlangganan untuk akses tanpa batas.",
        data: null,
      });
    }

    next();
  } catch (error) {
    console.error("Error in checkSubscription middleware:", error);
    return res.status(500).json({
      status: false,
      message: "Terjadi kesalahan saat memeriksa subscription.",
      data: error.message,
    });
  }
};

module.exports = checkSubscription;

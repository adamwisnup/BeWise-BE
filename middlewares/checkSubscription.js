const prisma = require("../configs/config");

const isSubscriptionActive = (booking) => {
  const currentDate = new Date();
  return (
    booking.status === "ACTIVE" && new Date(booking.end_date) > currentDate
  );
};

const remainingDays = (booking) => {
  const currentDate = new Date();
  const endDate = new Date(booking.end_date);

  if (isSubscriptionActive(booking)) {
    const diffTime = Math.abs(endDate - currentDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }
  return 0;
};

const subscriptionMiddleware = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const booking = await prisma.booking.findFirst({
      where: {
        user_id: userId,
        status: "ACTIVE",
      },
      orderBy: {
        end_date: "desc",
      },
    });

    if (!booking || !isSubscriptionActive(booking)) {
      return res.status(403).json({
        status: false,
        message: "Subscription Anda tidak aktif atau telah kedaluwarsa.",
        data: {
          remainingDays: booking ? remainingDays(booking) : 0,
        },
      });
    }

    req.booking = booking;
    next();
  } catch (error) {
    console.error("Error in subscriptionMiddleware:", error);
    return res.status(500).json({
      status: false,
      message: "Terjadi kesalahan saat memeriksa subscription.",
      error: error.message,
    });
  }
};

module.exports = subscriptionMiddleware;

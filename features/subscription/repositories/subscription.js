const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class SubscriptionRepository {
  async findSubscriptionById(id) {
    return prisma.subscription.findUnique({
      where: { id },
    });
  }

  async createBooking(data) {
    return prisma.booking.create({
      data,
    });
  }

  async findBookingById(id) {
    return prisma.booking.findUnique({
      where: { id },
    });
  }

  async updateBookingStatus(id, status) {
    return prisma.booking.update({
      where: { id },
      data: { status },
    });
  }

  async createPayment(data) {
    return prisma.payment.create({
      data,
    });
  }

  async findPaymentByTransactionId(transactionId) {
    return prisma.payment.findFirst({
      where: {
        transaction_id: transactionId,
      },
    });
  }

  async updatePaymentStatus(id, status) {
    return prisma.payment.update({
      where: { id },
      data: { status },
    });
  }

  async findAllSubscriptions() {
    return prisma.subscription.findMany();
  }
}

module.exports = new SubscriptionRepository();

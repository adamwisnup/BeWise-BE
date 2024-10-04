const prisma = require("../../../configs/config");

class InformationRepository {
  async createInformation(data) {
    return await prisma.information.create({
      data: {
        ...data,
      },
    });
  }

  async findAllInformation(data) {
    return await prisma.information.findMany();
  }

  async findInformationById(informationId) {
    return await prisma.information.findUnique({
      where: { id: informationId },
    });
  }

  async updateInformation(informationId, data) {
    return await prisma.information.update({
      where: { id: informationId },
      data: {
        ...data,
      },
    });
  }

  async deleteInformation(informationId) {
    return await prisma.information.delete({
      where: { id: informationId },
    });
  }
}

module.exports = new InformationRepository();

const prisma = require("../../../configs/config");

class UserRepository {
  async createUser(data) {
    return await prisma.user.create({
      data: {
        ...data,
      },
    });
  }

  async findAllUsers(data) {
    return await prisma.user.findMany();
  }

  async findUserByEmail(email) {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  async findUserById(userId) {
    return await prisma.user.findUnique({
      where: { id: userId },
    });
  }

  async updateUserAvatar(userId, avatarUrl) {
    return await prisma.user.update({
      where: {
        id: parseInt(userId),
      },
      data: {
        avatar_link: avatarUrl,
      },
    });
  }

  async updateUser(userId, updateData) {
    return await prisma.user.update({
      where: {
        id: parseInt(userId),
      },
      data: updateData,
    });
  }

  async updateUserByEmail(email, updateData) {
    return await prisma.user.update({
      where: {
        email,
      },
      data: updateData,
    });
  }
}

module.exports = new UserRepository();

const { name } = require("ejs");
const prisma = require("../../configs/config");
const bcrypt = require("bcrypt");

const seedAdmin = async () => {
  await prisma.admin.createMany({
    data: [
      {
        id: 1,
        email: "admin@mail.com",
        name: "Admin",
        password: bcrypt.hashSync("admin123", 10),
      },
    ],
  });
};

module.exports = { seedAdmin };

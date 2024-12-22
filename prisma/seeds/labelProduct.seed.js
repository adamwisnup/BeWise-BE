const prisma = require("../../configs/config");

const seedLabelProducts = async () => {
  await prisma.label.createMany({
    data: [
      {
        id: 1,
        name: "A",
        link: "https://ik.imagekit.io/awp2705/BeWise/Label/3%20530.svg?updatedAt=1730831537455",
      },
      {
        id: 2,
        name: "B",
        link: "https://ik.imagekit.io/awp2705/BeWise/Label/4%2085.svg?updatedAt=1730831681606",
      },
      {
        id: 3,
        name: "C",
        link: "https://ik.imagekit.io/awp2705/BeWise/Label/5%20221500.svg?updatedAt=1730831681577",
      },
      {
        id: 4,
        name: "D",
        link: "https://ik.imagekit.io/awp2705/BeWise/Label/6%201852.svg?updatedAt=1730831681535",
      },
      {
        id: 5,
        name: "E",
        link: "https://ik.imagekit.io/awp2705/BeWise/Label/7%2045604.svg?updatedAt=1730831681240",
      },
    ],
  });
};

module.exports = { seedLabelProducts };

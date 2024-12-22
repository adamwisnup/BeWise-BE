const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const news = await prisma.news.create({
    data: {
      title: 'Berapa Batas Konsumsi Gula, Garam, dan Lemak (GGL) per Hari?',
      content: `Pentingnya mengikuti anjuran konsumsi GGL\nAsupan gula, garam, dan lemak yang berlebihan bisa menyebabkan sejumlah masalah kesehatan.\n\nDampak utama dari kebiasaan makan ini antara lain obesitas serta Penyakit Tidak Menular (PTM) seperti tekanan darah tinggi, diabetes, penyakit jantung, dan kanker. \n\nBila Anda mengonsumsi gula secara berlebihan, tubuh akan mengubah kelebihan gula menjadi jaringan lemak.\n\nHal ini lambat laun dapat menyebabkan kenaikan berat badan dan obesitas, dua faktor yang meningkatkan risiko penyakit diabetes tipe 2. Begitu pun jika Anda banyak mengonsumsi makanan tinggi lemak.\n\nLemak yang tidak sehat bisa meningkatkan kadar kolesterol jahat. Kondisi ini bisa memicu pembentukan plak kolesterol pada pembuluh darah yang berujung menyebabkan penyakit jantung.\n\nEfek asupan garam yang berlebihan pun tidak kalah besar. Pola makan tinggi garam membuat Anda rentan mengalami tekanan darah tinggi.\n\nDengan adanya obesitas dan penumpukan plak, Anda berisiko lebih tinggi untuk mengalami stroke dan gagal jantung.`,
      image: 'https://cdn.hellosehat.com/wp-content/uploads/2017/05/konsumsi-gula.jpg?w=750&q=100',
      author: 'Diah Ayu Lestari',
    },
  });

  console.log({ news });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
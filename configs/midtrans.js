const midtransClient = require("midtrans-client");
require("dotenv").config();
const { MIDTRANS_SERVER_KEY, MIDTRANS_CLIENT_KEY } = process.env;

const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: MIDTRANS_SERVER_KEY,
  clientKey: MIDTRANS_CLIENT_KEY,
});

module.exports = snap;

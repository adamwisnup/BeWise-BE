const jwt = require("jsonwebtoken");
require("dotenv").config();

// const { JWT_SECRET_KEY } = process.env;

module.exports = async (req, res, next) => {
  const { authorization } = req.headers;

  // Cek apakah authorization header disediakan
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({
      status: false,
      message: "Token not provided!",
      data: null,
    });
  }

  const token = authorization.split(" ")[1];

  // Log token untuk memverifikasi apakah token sudah benar
  console.log("Token received:", token);

  // Verifikasi token menggunakan secret key
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    // Log secret key untuk memastikan nilainya diatur dengan benar
    console.log("JWT_SECRET_KEY:", process.env.JWT_SECRET_KEY);

    // Log decoded token untuk melihat hasilnya
    console.log("Decoded token:", decoded);

    if (err) {
      console.log("Error verifying token:", err); // Log error jika terjadi masalah saat verifikasi
      return res.status(401).json({
        status: false,
        message: "Failed to authenticate token",
        data: null,
      });
    }

    // Jika token valid, simpan decoded data ke req
    req.token = token;
    req.user = decoded;
    next();
  });
};

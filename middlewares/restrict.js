const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({
      status: false,
      message: "Token not provided!",
      data: null,
    });
  }

  const token = authorization.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      console.log("Error verifying token:", err);
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

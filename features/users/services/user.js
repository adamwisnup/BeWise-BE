const UserRepository = require("../repositories/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = process.env;
const imagekit = require("../../../libs/imagekit");
const path = require("path");

class UserService {
  async register(data) {
    const { name, email, password } = data;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Format email tidak valid");
    }

    const existingUser = await UserRepository.findUserByEmail(email);
    if (existingUser) {
      throw new Error("Email sudah terdaftar");
    }

    if (!name || !email || !password) {
      throw new Error("Kolom yang wajib diisi tidak lengkap");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await UserRepository.createUser({
      name,
      email,
      password: hashedPassword,
    });

    delete user.password;

    return { user };
  }

  async login(data) {
    const { email, password } = data;

    if (!email || !password) {
      throw new Error("Email dan password wajib diisi");
    }

    const user = await UserRepository.findUserByEmail(email);
    if (!user) {
      throw new Error("Email atau password salah");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Email atau password salah");
    }

    delete user.password;

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    return { user, token };
  }

  async getAllUser() {
    try {
      const users = await UserRepository.findAllUsers();

      // Hapus password dari setiap user
      const sanitizedUsers = users.map((user) => {
        const { password, ...rest } = user; // Hapus password dan ambil field lainnya
        return rest;
      });

      return sanitizedUsers;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getUserFromToken(token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET_KEY);
      const userId = decoded.userId;

      const user = await UserRepository.findUserById(userId);

      if (!user) {
        throw new Error("Pengguna tidak ditemukan");
      }

      delete user.password;

      return user;
    } catch (error) {
      // console.error("Kesalahan pada getUserFromToken:", error);
      throw new Error("Token tidak valid atau sudah kadaluarsa");
    }
  }

  async logout(req, res) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
          status: false,
          message: "Token otorisasi diperlukan",
          data: null,
        });
      }

      const token = authHeader.split(" ")[1];

      jwt.verify(token, JWT_SECRET_KEY);

      return { status: true, message: "Berhasil logout" };
    } catch (error) {
      throw new Error("Token tidak valid atau sudah kadaluarsa");
    }
  }

  async updateAvatar(avatar, userId) {
    try {
      const fileBase64 = avatar.buffer.toString("base64");

      const response = await imagekit.upload({
        fileName: Date.now() + path.extname(avatar.originalname),
        file: fileBase64,
        folder: "BeWise",
      });

      const fileUrl = response.url;

      await UserRepository.updateUserAvatar(userId, fileUrl);

      return fileUrl;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateProfile(data, userId) {
    const { name, email, gender } = data;

    const existingUser = await UserRepository.findUserById(userId);
    if (!existingUser) {
      throw new Error("Pengguna tidak ditemukan");
    }

    if (name && name.length < 3) {
      throw new Error("Nama harus terdiri dari setidaknya 3 karakter");
    }

    if (email && !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)) {
      throw new Error("Format email tidak valid");
    }

    const updatedData = {
      name: name || existingUser.name,
      email: email || existingUser.email,
      gender: gender || existingUser.gender,
    };

    const user = await UserRepository.updateUser(userId, updatedData);

    delete user.password;

    return user;
  }
}

module.exports = new UserService();

const UserService = require("../services/user");
class UserController {
  async register(req, res) {
    try {
      const { name, email, password } = req.body;

      if (!name) {
        return res.status(400).json({
          status: false,
          message: "Nama tidak boleh kosong",
          data: null,
        });
      }

      if (!email) {
        return res.status(400).json({
          status: false,
          message: "Email tidak boleh kosong",
          data: null,
        });
      }

      if (!password) {
        return res.status(400).json({
          status: false,
          message: "Password tidak boleh kosong",
          data: null,
        });
      }

      const { user } = await UserService.register({
        name,
        email,
        password,
      });

      res.status(201).json({
        status: true,
        message: "Pengguna berhasil terdaftar",
        data: { user },
      });
    } catch (error) {
      console.error("Error saat mendaftarkan pengguna:", error);
      res.status(500).json({
        status: false,
        message: error.message || "Terjadi kesalahan pada server",
        data: null,
      });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email) {
        return res.status(400).json({
          status: false,
          message: "Email tidak boleh kosong",
          data: null,
        });
      }

      if (!password) {
        return res.status(400).json({
          status: false,
          message: "Password tidak boleh kosong",
          data: null,
        });
      }

      const { user, token } = await UserService.login({ email, password });

      res.status(200).json({
        status: true,
        message: "Login berhasil",
        data: { user, token },
      });
    } catch (error) {
      console.error("Error saat login:", error);
      res.status(401).json({
        status: false,
        message: error.message || "Tidak diizinkan",
        data: null,
      });
    }
  }

  async whoami(req, res) {
    try {
      const authorization = req.headers.authorization;

      if (!authorization || !authorization.startsWith("Bearer ")) {
        return res.status(401).json({
          status: false,
          message: "Token otorisasi dibutuhkan",
          data: null,
        });
      }

      const token = authorization.split(" ")[1];
      const user = await UserService.getUserFromToken(token);

      res.status(200).json({
        status: true,
        message: "Data pengguna berhasil diambil",
        data: user,
      });
    } catch (error) {
      console.error("Error saat mengambil data pengguna:", error);
      res.status(401).json({
        status: false,
        message: error.message || "Tidak diizinkan",
        data: null,
      });
    }
  }

  async logout(req, res) {
    try {
      const result = await UserService.logout(req, res);

      res.status(200).json({
        status: true,
        message: result.message,
        data: null,
      });
    } catch (error) {
      console.error("Error saat logout:", error);
      res.status(401).json({
        status: false,
        message: error.message || "Tidak diizinkan",
        data: null,
      });
    }
  }

  async updateAvatar(req, res) {
    try {
      const avatar = req.file;

      if (!avatar) {
        return res.status(400).json({
          status: false,
          message: "File avatar tidak ada.",
          data: null,
        });
      }

      console.log("User dari req.user:", req.user);

      if (!req.user || !req.user.userId) {
        return res.status(400).json({
          status: false,
          message: "ID pengguna tidak ada.",
          data: null,
        });
      }

      const fileUrl = await UserService.updateAvatar(avatar, req.user.userId);

      res.status(200).json({
        status: true,
        message: "Avatar berhasil diperbarui",
        data: {
          avatar_link: fileUrl,
        },
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: error.message,
        data: null,
      });
    }
  }

  async updateProfile(req, res) {
    try {
      const userId = req.user.userId;
      const { name, email, gender } = req.body;

      if (!userId) {
        return res.status(400).json({
          status: false,
          message: "ID pengguna tidak ada.",
          data: null,
        });
      }

      const data = { name, email, gender };
      const user = await UserService.updateProfile(data, userId);

      res.status(200).json({
        status: true,
        message: "Profil berhasil diperbarui",
        data: user,
      });
    } catch (error) {
      res.status(400).json({
        status: false,
        message: error.message,
        data: null,
      });
    }
  }

  async getAllUser(req, res) {
    try {
      const users = await UserService.getAllUser();

      res.status(200).json({
        status: true,
        message: "Data pengguna berhasil diambil",
        data: users,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: error.message,
        data: null,
      });
    }
  }
}

module.exports = new UserController();

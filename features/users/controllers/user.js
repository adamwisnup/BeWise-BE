const UserService = require("../services/user");
const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = process.env;
const nodemailer = require("../../../libs/nodemailer");
class UserController {
  async register(req, res) {
    try {
      const { first_name, last_name, email, password } = req.body;

      if (!first_name) {
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
        first_name,
        last_name,
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

      if (!user.password && user.google_id) {
        return res.status(400).json({
          status: false,
          message:
            "Anda telah mendaftar dengan akun Google. Silakan login dengan Google",
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

      // console.log("User dari req.user:", req.user);

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
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({
        success: false,
        message: error.message,
        data: null,
      });
    }
  }

  async updateProfile(req, res) {
    try {
      const userId = req.user.userId;
      const { first_name, last_name, email, gender } = req.body;

      if (!userId) {
        return res.status(400).json({
          status: false,
          message: "ID pengguna tidak ada.",
          data: null,
        });
      }

      const data = { first_name, last_name, email, gender };
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

  async forgotPassword(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          status: false,
          message: "Email wajib diisi",
          data: null,
        });
      }

      const user = await UserService.findUserByEmail(email);

      if (!user) {
        return res.status(404).json({
          status: false,
          message: "Email tidak terdaftar",
          data: null,
        });
      }

      const token = jwt.sign({ email: user.email }, JWT_SECRET_KEY, {
        expiresIn: "1h",
      });

      const url = `${req.protocol}://${req.get(
        "host"
      )}/api/v1/reset-password?token=${token}`;

      const html = await nodemailer.getHTML("forgot-password.ejs", {
        name: user.first_name,
        url: url,
      });

      await nodemailer.sendMail(email, "Reset Password", html);

      res.status(200).json({
        status: true,
        message: "Email reset password berhasil dikirim",
        data: null,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: error.message,
        data: null,
      });
    }
  }

  async resetPassword(req, res) {
    try {
      const { token } = req.query;
      const { password, confirmPassword } = req.body;

      if (!password || !confirmPassword) {
        return res.status(400).json({
          status: false,
          message: "Password dan konfirmasi password wajib diisi",
          data: null,
        });
      }

      const decoded = jwt.verify(token, JWT_SECRET_KEY);

      if (decoded) {
        const updatedUser = await UserService.resetPassword(
          decoded.email,
          token,
          password,
          confirmPassword
        );

        const { password: _, ...userWithoutPassword } = updatedUser;

        return res.status(200).json({
          status: true,
          message: "Password berhasil direset",
          data: userWithoutPassword,
        });
      }
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: error.message,
        data: null,
      });
    }
  }

  async resetPasswordPage(req, res) {
    try {
      let { token } = req.query;
      res.render("reset-password.ejs", {
        token,
        layout: false,
      });
    } catch (error) {
      res.status(400).json({
        status: false,
        message: error.message,
        data: null,
      });
    }
  }

  async resetPasswordTestPage(req, res) {
    try {
      // let { token } = req.query;
      res.render("reset-password-test.ejs", {
        // token,
        layout: false,
      });
    } catch (error) {
      res.status(400).json({
        status: false,
        message: error.message,
        data: null,
      });
    }
  }

  async forgotEmailPage(req, res) {
    try {
      res.render("forgot-password-test.ejs", {
        layout: false,
      });
    } catch (error) {
      res.status(400).json({
        status: false,
        message: error.message,
        data: null,
      });
    }
  }

  async loginOauth(req, res) {
    try {
      const token = await UserService.generateTokenOAuth(req.user);

      return res.status(200).json({
        status: true,
        message: "Login berhasil",
        data: { user: req.user, token },
      });
    } catch (err) {
      return res.status(500).json({
        status: false,
        message: err.message,
        data: null,
      });
    }
  }
}

module.exports = new UserController();

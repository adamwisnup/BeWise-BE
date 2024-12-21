const { token } = require("morgan");
const AdminRepository = require("../repositories/admin");
const bcrypt = require("bcrypt");

class AdminService {
  async login(data) {
    const { email, password } = data;

    if (!email) {
      throw new Error("Email wajib diisi");
    }

    if (!password) {
      throw new Error("Password wajib diisi");
    }

    const admin = await AdminRepository.findAdminByEmail(email);
    if (!admin) {
      throw new Error("Email atau password salah");
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      throw new Error("Email atau password salah");
    }

    delete admin.password;

    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    return { token, admin };
  }
}

const express = require("express");
const router = express.Router();
const restrict = require("../middlewares/restrict");
const { image } = require("../libs/multer");
const UserController = require("../features/users/controllers/user");
const ProductController = require("../features/products/controllers/product");

// TESTING
router.get("/users", UserController.getAllUser);

// AUTHENTICATION
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/whoami", restrict, UserController.whoami);

// USER PROFILE
router.patch(
  "/avatar-profile",
  restrict,
  image.single("avatar"),
  UserController.updateAvatar
);
router.patch("/profile", restrict, UserController.updateProfile);

// PRODUCT
router.get("/products", restrict, ProductController.getAllProducts);
router.get("/products/:id", restrict, ProductController.getProductById);
router.get(
  "/products/category/:category",
  restrict,
  ProductController.getProductByCategory
);
router.delete("/products/:id", restrict, ProductController.deleteProduct);

module.exports = router;

const express = require("express");
const router = express.Router();
const restrict = require("../middlewares/restrict");
const { image } = require("../libs/multer");
const UserController = require("../features/users/controllers/user");
const ProductController = require("../features/products/controllers/product");
const InformationController = require("../features/informations/controllers/information");

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

// INFORMATION
router.post(
  "/informations",
  restrict,
  image.single("image"),
  InformationController.createInformation
);
router.get("/informations", restrict, InformationController.getAllInformations);
router.get(
  "/informations/:id",
  restrict,
  InformationController.getInformationById
);
router.patch(
  "/informations/:id",
  restrict,
  image.single("image"),
  InformationController.updateInformation
);
router.delete(
  "/informations/:id",
  restrict,
  InformationController.deleteInformation
);

module.exports = router;

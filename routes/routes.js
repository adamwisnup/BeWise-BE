const express = require("express");
const router = express.Router();
const restrict = require("../middlewares/restrict");
const { image } = require("../libs/multer");
const passport = require("../libs/passport");
const UserController = require("../features/users/controllers/user");
const ProductController = require("../features/products/controllers/product");
const InformationController = require("../features/informations/controllers/information");
const NewsController = require("../features/news/controllers/news");
const HistoryController = require("../features/histories/controllers/history");
const SubscriptionController = require("../features/subscription/controllers/subscription");
const AdminController = require("../features/admins/controllers/admin");

// AUTHENTICATION
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/whoami", restrict, UserController.whoami);
router.get("/forgot-password", UserController.forgotEmailPage);
router.post("/forgot-password", UserController.forgotPassword);
router.get("/reset-password", UserController.resetPasswordPage);
router.post("/reset-password", UserController.resetPassword);
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/api/v1/auth/google",
    session: false,
  }),
  UserController.loginOauth
);

// USER PROFILE
router.patch(
  "/avatar-profile",
  restrict,
  image.single("avatar"),
  UserController.updateAvatar
);
router.patch("/profile", restrict, UserController.updateProfile);

// CATEGORY PRODUCT
router.get(
  "/categories/products",
  restrict,
  ProductController.getAllCategoryProduct
);

// PRODUCT
router.post(
  "/products/beverages",
  restrict,
  image.single("photo"),
  ProductController.addBeverageProduct
);
router.post(
  "/products/foods",
  restrict,
  image.single("photo"),
  ProductController.addFoodProduct
);
router.patch(
  "/products/:id/foods",
  restrict,
  image.single("photo"),
  ProductController.updateFoodProduct
);
router.patch(
  "/products/:id/beverages",
  restrict,
  image.single("photo"),
  ProductController.updateBeverageProduct
);
router.get("/products", restrict, ProductController.getAllProducts);
router.post("/products/scan", restrict, ProductController.scanProduct);
router.get("/products/top-choices", restrict, ProductController.getTopChoices);
router.get("/products/search", restrict, ProductController.searchProducts);
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

// NEWS
router.post(
  "/news",
  restrict,
  image.single("image"),
  NewsController.createNews
);
router.get("/news", restrict, NewsController.getAllNews);
router.get("/news/:id", restrict, NewsController.getNewsById);
router.patch(
  "/news/:id",
  restrict,
  image.single("image"),
  NewsController.updateNews
);
router.delete("/news/:id", restrict, NewsController.deleteNews);

// HISTORY
router.get("/histories", restrict, HistoryController.getAllHistories);
router.get("/histories/:id", restrict, HistoryController.getHistoryById);
router.get("/histories/recommendation/:id", restrict, HistoryController.getProudctHistoryWithRecommendationById);
router.delete("/histories/:id", restrict, HistoryController.deleteHistory);

// SUBSCRIPTION
router.post(
  "/subscriptions/booking",
  restrict,
  SubscriptionController.createBooking
);
router.post(
  "/subscriptions/booking/notification",
  SubscriptionController.handleMidtransNotification
);

// ADMIN
router.post("/admin/login", AdminController.login);
router.get("/admin/products", restrict, AdminController.findAllProducts);
router.get(
  "/admin/products/category/:category",
  restrict,
  AdminController.findProductByCategory
);
router.get("/admin/products/:id", restrict, AdminController.findProductById);
router.post("/admin/products", restrict, AdminController.createProduct);

module.exports = router;

const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const userController = require("../controllers/userController");

// GET /api/products -> Ruft die getAllProducts Funktion im Controller auf
router.get("/products", productController.getAllProducts);

// GET /api/products/:id -> Ruft die getProductById Funktion im Controller auf
router.get("/products/:id", productController.getProductById);

router.post("/register", userController.register);

// NEU: POST /api/users/login
router.post("/login", userController.login);

module.exports = router;

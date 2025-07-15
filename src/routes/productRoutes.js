const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// GET /api/products -> Ruft die getAllProducts Funktion im Controller auf
router.get("/products", productController.getAllProducts);

// GET /api/products/:id -> Ruft die getProductById Funktion im Controller auf
router.get("/products/:id", productController.getProductById);

module.exports = router;

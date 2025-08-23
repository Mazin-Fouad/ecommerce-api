const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { 
  validatePagination, 
  validatePriceFilter, 
  validateSearch 
} = require("../middleware/validationMiddleware");

// GET /api/products -> Ruft die getAllProducts Funktion im Controller auf
router.get("/", 
  validatePagination,
  validatePriceFilter,
  validateSearch,
  productController.getAllProducts
);

// GET /api/products/:id -> Ruft die getProductById Funktion im Controller auf
router.get("/:id", productController.getProductById);

module.exports = router;

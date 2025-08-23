const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const { protect } = require("../middleware/authMiddleware");

// Alle Cart-Routen erfordern Authentifizierung
router.use(protect);

// GET /api/cart -> Warenkorb abrufen
router.get("/", cartController.getCart);

// POST /api/cart -> Produkt zum Warenkorb hinzufügen
router.post("/", cartController.addToCart);

// PUT /api/cart/:itemId -> Warenkorb-Item aktualisieren
router.put("/:itemId", cartController.updateCartItem);

// DELETE /api/cart/:itemId -> Produkt aus Warenkorb entfernen
router.delete("/:itemId", cartController.removeFromCart);

// DELETE /api/cart -> Warenkorb leeren
router.delete("/", cartController.clearCart);

module.exports = router;
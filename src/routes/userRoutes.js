const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const { 
  validateUserRegistration, 
  validateUserLogin 
} = require("../middleware/validationMiddleware");

router.post("/register", validateUserRegistration, userController.register);

router.post("/login", validateUserLogin, userController.login);

// Die protect-Middleware stellt sicher, dass nur ein eingeloggter Benutzer darauf zugreifen kann.
// Die ID wird aus dem Token genommen, daher ist kein /:id im Pfad nötig.
router.put("/profile", protect, userController.updateUser);

module.exports = router;

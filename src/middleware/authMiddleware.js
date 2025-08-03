const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const protect = async (req, res, next) => {
  let token;

  // Prüfen, ob der Authorization-Header vorhanden ist und mit "Bearer" beginnt
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Den Token aus dem Header extrahieren (Format: "Bearer TOKEN")
      token = req.headers.authorization.split(" ")[1];

      // Den Token verifizieren
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Den Benutzer anhand der ID im Token finden und an das Request-Objekt anhängen
      // Das Passwort wird zur Sicherheit ausgeschlossen
      req.user = await User.findByPk(decoded.id, {
        attributes: { exclude: ["password"] },
      });

      if (!req.user) {
        return res.status(401).json({ message: "Benutzer nicht gefunden." });
      }

      // Mit dem nächsten Middleware-Schritt fortfahren
      next();
    } catch (error) {
      console.error(error);
      res
        .status(401)
        .json({ message: "Nicht autorisiert, Token fehlgeschlagen" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Nicht autorisiert, kein Token" });
  }
};

module.exports = { protect };

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

// Route Imports
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const cartRoutes = require("./routes/cartRoutes");

// Error Handlers
const errorHandler = require("./middleware/errorHandler");
const notFoundHandler = require("./middleware/notFoundHandler");

/**
 * @module Application
 * @description Zentrale Express-Anwendungskonfiguration für die E-Commerce API.
 * Konfiguriert Middleware, Sicherheitseinstellungen und Routing.
 */

/**
 * Express-Anwendungsinstanz erstellen
 * @type {express.Application}
 */
const app = express();

/**
 * Globale Middleware-Konfiguration
 * @description Basis-Middleware für Sicherheit, Logging und Request-Verarbeitung
 */

// Sicherheits-Middleware
app.use(helmet());

// CORS-Konfiguration
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(",") || "*",
    credentials: true,
  })
);

// Request-Logging (nur in Entwicklung)
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Rate-Limiting für API-Schutz
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 Minuten
  max: 100, // Max. 100 Requests pro IP
  message: "Zu viele Anfragen von dieser IP, bitte später erneut versuchen.",
});
app.use("/api/", limiter);

// Body-Parser Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

/**
 * API Status-Endpunkt
 * @description Liefert grundlegende API-Informationen und Health-Check
 * @route GET /
 * @returns {Object} 200 - API-Status und Versionsinformationen
 */
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Willkommen bei der E-Commerce API!",
    version: process.env.API_VERSION || "1.0.0",
    status: "operational",
    timestamp: new Date().toISOString(),
  });
});

/**
 * Health-Check Endpunkt
 * @description Überprüft den Gesundheitszustand der API
 * @route GET /health
 * @returns {Object} 200 - Gesundheitsstatus der API
 */
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });

  //TODO: Die Funktuion wird später aufgebaut damit E-Mail-Benachrichtigungen versendet werden können
});

/**
 * API-Routen Registrierung
 * @description Mountet alle verfügbaren API-Endpunkte unter /api
 */

// Benutzer-Management Routen
app.use("/api/users", userRoutes);

// Produkt-Management Routen
app.use("/api/products", productRoutes);

// Warenkorb-Management Routen
app.use("/api/cart", cartRoutes);

/**
 * Fehlerbehandlung
 * @description Globale Error-Handler müssen als letzte Middleware registriert werden
 */

// 404 Handler für nicht existierende Routen
app.use(notFoundHandler);

// Zentraler Error-Handler
app.use(errorHandler);

module.exports = app;

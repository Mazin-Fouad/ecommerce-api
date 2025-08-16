/**
 * @module ErrorHandler
 * @description Zentraler Error-Handler für die gesamte Anwendung
 */

/**
 * Globaler Error-Handler Middleware
 * @description Verarbeitet alle Fehler und sendet strukturierte Antworten
 */
const errorHandler = (err, req, res, next) => {
  // Default-Werte falls nicht gesetzt
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // Entwicklungs-Modus: Vollständige Fehlerdetails
  if (process.env.NODE_ENV === "development") {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack,
    });
  }

  // Produktions-Modus: Sichere Fehlerausgabe
  res.status(err.statusCode).json({
    status: err.status,
    message:
      err.statusCode === 500
        ? "Ein interner Serverfehler ist aufgetreten"
        : err.message,
  });
};

module.exports = errorHandler;

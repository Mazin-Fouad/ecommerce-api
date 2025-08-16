/**
 * @module NotFoundHandler
 * @description Handler für nicht existierende Routen
 */

/**
 * 404 Not Found Handler
 * @description Fängt alle Anfragen auf nicht existierende Endpunkte ab
 */
const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    status: "error",
    message: `Die angeforderte Route ${req.originalUrl} existiert nicht.`,
  });
};

module.exports = notFoundHandler;

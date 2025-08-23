/**
 * @module ValidationMiddleware
 * @description Middleware für Eingabevalidierung und Datenbereinigung
 */

/**
 * Validiert Benutzerregistrierungsdaten
 * @function validateUserRegistration
 * @description Prüft alle erforderlichen Felder für die Benutzerregistrierung
 */
const validateUserRegistration = (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;
  const errors = [];

  // Pflichtfelder prüfen
  if (!firstName || firstName.trim().length === 0) {
    errors.push("Vorname ist erforderlich");
  } else if (firstName.trim().length < 2 || firstName.trim().length > 50) {
    errors.push("Vorname muss zwischen 2 und 50 Zeichen lang sein");
  }

  if (!lastName || lastName.trim().length === 0) {
    errors.push("Nachname ist erforderlich");
  } else if (lastName.trim().length < 2 || lastName.trim().length > 50) {
    errors.push("Nachname muss zwischen 2 und 50 Zeichen lang sein");
  }

  if (!email || email.trim().length === 0) {
    errors.push("E-Mail ist erforderlich");
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      errors.push("Ungültiges E-Mail-Format");
    }
  }

  if (!password || password.length === 0) {
    errors.push("Passwort ist erforderlich");
  } else if (password.length < 6) {
    errors.push("Passwort muss mindestens 6 Zeichen lang sein");
  } else if (password.length > 100) {
    errors.push("Passwort darf maximal 100 Zeichen lang sein");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      message: "Validierungsfehler",
      errors,
    });
  }

  // Daten bereinigen
  req.body.firstName = firstName.trim();
  req.body.lastName = lastName.trim();
  req.body.email = email.trim().toLowerCase();

  next();
};

/**
 * Validiert Benutzeranmeldedaten
 * @function validateUserLogin
 * @description Prüft E-Mail und Passwort für die Anmeldung
 */
const validateUserLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || email.trim().length === 0) {
    errors.push("E-Mail ist erforderlich");
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      errors.push("Ungültiges E-Mail-Format");
    }
  }

  if (!password || password.length === 0) {
    errors.push("Passwort ist erforderlich");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      message: "Validierungsfehler",
      errors,
    });
  }

  // Daten bereinigen
  req.body.email = email.trim().toLowerCase();

  next();
};

/**
 * Validiert Produktdaten
 * @function validateProduct
 * @description Prüft alle erforderlichen Felder für Produkterstellung/-aktualisierung
 */
const validateProduct = (req, res, next) => {
  const { name, price, sku, stock } = req.body;
  const errors = [];

  if (!name || name.trim().length === 0) {
    errors.push("Produktname ist erforderlich");
  } else if (name.trim().length < 2 || name.trim().length > 100) {
    errors.push("Produktname muss zwischen 2 und 100 Zeichen lang sein");
  }

  if (price === undefined || price === null) {
    errors.push("Preis ist erforderlich");
  } else {
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum < 0) {
      errors.push("Preis muss eine positive Zahl sein");
    }
  }

  if (!sku || sku.trim().length === 0) {
    errors.push("SKU ist erforderlich");
  } else if (sku.trim().length > 50) {
    errors.push("SKU darf maximal 50 Zeichen lang sein");
  }

  if (stock !== undefined && stock !== null) {
    const stockNum = parseInt(stock);
    if (isNaN(stockNum) || stockNum < 0) {
      errors.push("Lagerbestand muss eine nicht-negative Zahl sein");
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      message: "Validierungsfehler",
      errors,
    });
  }

  // Daten bereinigen
  if (req.body.name) req.body.name = req.body.name.trim();
  if (req.body.sku) req.body.sku = req.body.sku.trim().toUpperCase();
  if (req.body.description) req.body.description = req.body.description.trim();
  if (req.body.category) req.body.category = req.body.category.trim();
  if (req.body.brand) req.body.brand = req.body.brand.trim();

  next();
};

/**
 * Validiert Paginierungsparameter
 * @function validatePagination
 * @description Prüft und bereinigt page und limit Parameter
 */
const validatePagination = (req, res, next) => {
  let { page = 1, limit = 10 } = req.query;

  // Page validieren
  page = parseInt(page);
  if (isNaN(page) || page < 1) {
    page = 1;
  }

  // Limit validieren
  limit = parseInt(limit);
  if (isNaN(limit) || limit < 1) {
    limit = 10;
  } else if (limit > 100) {
    limit = 100; // Maximales Limit für Performance
  }

  req.query.page = page;
  req.query.limit = limit;

  next();
};

/**
 * Validiert Preisfilter
 * @function validatePriceFilter
 * @description Prüft minPrice und maxPrice Parameter
 */
const validatePriceFilter = (req, res, next) => {
  const { minPrice, maxPrice } = req.query;

  if (minPrice !== undefined) {
    const min = parseFloat(minPrice);
    if (isNaN(min) || min < 0) {
      return res.status(400).json({
        message: "Ungültiger Mindestpreis",
        error: "Mindestpreis muss eine positive Zahl sein",
      });
    }
    req.query.minPrice = min;
  }

  if (maxPrice !== undefined) {
    const max = parseFloat(maxPrice);
    if (isNaN(max) || max < 0) {
      return res.status(400).json({
        message: "Ungültiger Höchstpreis",
        error: "Höchstpreis muss eine positive Zahl sein",
      });
    }
    req.query.maxPrice = max;
  }

  if (minPrice !== undefined && maxPrice !== undefined && req.query.minPrice > req.query.maxPrice) {
    return res.status(400).json({
      message: "Ungültiger Preisbereich",
      error: "Mindestpreis darf nicht höher als Höchstpreis sein",
    });
  }

  next();
};

/**
 * Bereinigt und validiert Suchparameter
 * @function validateSearch
 * @description Prüft Suchbegriff auf Länge und bereinigt ihn
 */
const validateSearch = (req, res, next) => {
  const { search } = req.query;

  if (search !== undefined) {
    const cleanSearch = search.trim();
    
    if (cleanSearch.length === 0) {
      delete req.query.search;
    } else if (cleanSearch.length > 100) {
      return res.status(400).json({
        message: "Ungültiger Suchbegriff",
        error: "Suchbegriff darf maximal 100 Zeichen lang sein",
      });
    } else {
      req.query.search = cleanSearch;
    }
  }

  next();
};

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validateProduct,
  validatePagination,
  validatePriceFilter,
  validateSearch,
};
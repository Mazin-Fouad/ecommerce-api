const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

/**
 * @module UserController
 * @description Controller für alle benutzerbezogenen Operationen.
 * Verwaltet Registrierung, Authentifizierung und Benutzerdatenverwaltung.
 */

/**
 * Registriert einen neuen Benutzer im System.
 *
 * @async
 * @function register
 * @description Erstellt ein neues Benutzerkonto mit verschlüsseltem Passwort.
 * Validiert alle erforderlichen Felder und prüft auf doppelte E-Mail-Adressen.
 *
 * @requires Request.body.firstName - Vorname des Benutzers
 * @requires Request.body.lastName - Nachname des Benutzers
 * @requires Request.body.email - Eindeutige E-Mail-Adresse
 * @requires Request.body.password - Passwort (wird automatisch gehasht)
 *
 * @returns {Object} 201 - Erfolgreich registrierter Benutzer ohne sensible Daten
 * @returns {Object} 400 - Fehlende Pflichtfelder
 * @returns {Object} 409 - E-Mail-Adresse bereits registriert
 * @returns {Object} 500 - Interner Serverfehler
 */
const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Eingabevalidierung
    const missingFields = [];
    if (!firstName) missingFields.push("Vorname");
    if (!lastName) missingFields.push("Nachname");
    if (!email) missingFields.push("E-Mail");
    if (!password) missingFields.push("Passwort");

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Folgende Pflichtfelder fehlen: ${missingFields.join(", ")}.`,
      });
    }

    // Duplikatsprüfung
    const emailAlreadyExists = await User.findOne({ where: { email } });
    if (emailAlreadyExists) {
      return res.status(409).json({
        message: "Diese E-Mail-Adresse ist bereits registriert.",
      });
    }

    // Benutzererstellung
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password,
    });

    // Sichere Antwort ohne sensible Daten
    const safeUserData = {
      id: newUser.id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
    };

    res.status(201).json({
      message: "Registrierung erfolgreich abgeschlossen.",
      user: safeUserData,
    });
  } catch (error) {
    console.error("Registrierungsfehler:", error);
    res.status(500).json({
      message: "Bei der Registrierung ist ein Fehler aufgetreten.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Authentifiziert einen Benutzer und stellt JWT-Token aus.
 *
 * @async
 * @function login
 * @description Verifiziert Benutzeranmeldedaten und generiert einen zeitlich
 * begrenzten JWT-Token für authentifizierte API-Zugriffe.
 *
 * @requires Request.body.email - Registrierte E-Mail-Adresse
 * @requires Request.body.password - Benutzerpasswort im Klartext
 *
 * @returns {Object} 200 - JWT-Token für authentifizierte Anfragen
 * @returns {Object} 400 - Fehlende Anmeldedaten
 * @returns {Object} 401 - Ungültige Anmeldedaten
 * @returns {Object} 500 - Interner Serverfehler
 *
 * @security Verwendet bcrypt für Passwort-Vergleich
 * @security Generische Fehlermeldung verhindert E-Mail-Enumeration
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Eingabevalidierung
    if (!email || !password) {
      return res.status(400).json({
        message: "E-Mail und Passwort sind erforderlich.",
      });
    }

    // Benutzerauthentifizierung
    const user = await User.findOne({ where: { email } });

    // Sicherheitshinweis: Identische Fehlermeldung für beide Fälle
    const isValidCredentials = user && (await user.comparePassword(password));
    if (!isValidCredentials) {
      return res.status(401).json({
        message: "Anmeldedaten sind ungültig.",
      });
    }

    // JWT-Token generierung
    const tokenPayload = {
      id: user.id,
      email: user.email,
    };

    const accessToken = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "24h",
    });

    res.status(200).json({
      message: "Anmeldung erfolgreich.",
      token: accessToken,
      expiresIn: process.env.JWT_EXPIRES_IN || "24h",
    });
  } catch (error) {
    console.error("Anmeldefehler:", error);
    res.status(500).json({
      message: "Bei der Anmeldung ist ein Fehler aufgetreten.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Aktualisiert Benutzerdaten des authentifizierten Benutzers.
 *
 * @async
 * @function updateUser
 * @description Ermöglicht einem authentifizierten Benutzer die Änderung seiner
 * persönlichen Daten. E-Mail-Änderungen werden auf Duplikate geprüft.
 *
 * @requires Authentication - JWT-Token im Authorization-Header
 * @requires Request.body.firstName - Neuer Vorname
 * @requires Request.body.lastName - Neuer Nachname
 * @requires Request.body.email - Neue E-Mail-Adresse
 * @optional Request.body.password - Neues Passwort (optional)
 *
 * @returns {Object} 200 - Aktualisierte Benutzerdaten ohne Passwort
 * @returns {Object} 400 - Fehlende Pflichtfelder
 * @returns {Object} 404 - Benutzer nicht gefunden
 * @returns {Object} 409 - Neue E-Mail bereits vergeben
 * @returns {Object} 500 - Interner Serverfehler
 */
const updateUser = async (req, res) => {
  try {
    // Benutzer aus JWT-Token laden
    const currentUser = await User.findByPk(req.user.id);

    if (!currentUser) {
      return res.status(404).json({
        message: "Benutzerkonto nicht gefunden.",
      });
    }

    const { firstName, lastName, email, password } = req.body;

    // Pflichtfelder validieren
    const requiredFields = { firstName, lastName, email };
    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Folgende Pflichtfelder fehlen: ${missingFields.join(", ")}.`,
      });
    }

    // E-Mail-Duplikatsprüfung bei Änderung
    const isEmailChanged = email !== currentUser.email;
    if (isEmailChanged) {
      const emailTaken = await User.findOne({ where: { email } });
      if (emailTaken) {
        return res.status(409).json({
          message: "Diese E-Mail-Adresse wird bereits verwendet.",
        });
      }
    }

    // Benutzerdaten aktualisieren
    Object.assign(currentUser, {
      firstName,
      lastName,
      email,
      ...(password && { password }), // Passwort nur wenn vorhanden
    });

    await currentUser.save();

    // Sichere Antwort ohne Passwort
    const updatedUserData = {
      id: currentUser.id,
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      email: currentUser.email,
    };

    res.status(200).json({
      message: "Benutzerdaten erfolgreich aktualisiert.",
      user: updatedUserData,
    });
  } catch (error) {
    console.error("Aktualisierungsfehler:", error);
    res.status(500).json({
      message: "Bei der Aktualisierung ist ein Fehler aufgetreten.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = {
  register,
  login,
  updateUser,
};

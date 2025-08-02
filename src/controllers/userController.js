const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "Bitte alle Felder ausfüllen." });
    }

    const existingUser = await User.findOne({ where: { email: email } });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "Ein Benutzer mit dieser E-Mail existiert bereits." });
    }

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password,
    });

    res.status(201).json({
      message: "Benutzer erfolgreich registriert.",
      user: {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Fehler bei der Registrierung.", error: error.message });
  }
};

// NEU: Die Funktion für den Login-Prozess
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validierung: Sind die Anmeldedaten überhaupt vorhanden?
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Bitte E-Mail und Passwort angeben." });
    }

    // 2. Benutzersuche: Finde den Benutzer anhand seiner einzigartigen E-Mail.
    const user = await User.findOne({ where: { email } });

    // 3. Authentifizierung: Prüfe, ob der Benutzer existiert UND ob das Passwort korrekt ist.
    // Wir nutzen unsere neue `comparePassword`-Methode aus dem Modell.
    // SICHERHEITS-TIPP: Gib IMMER die gleiche Fehlermeldung zurück, egal ob die E-Mail falsch
    // war oder das Passwort. So kann ein Angreifer nicht erraten, welche E-Mails in deinem System registriert sind.
    if (!user || !(await user.comparePassword(password))) {
      // 401 Unauthorized ist der korrekte HTTP-Statuscode für fehlgeschlagene Logins.
      return res.status(401).json({
        message:
          "Authentifizierung fehlgeschlagen. E-Mail oder Passwort ungültig.",
      });
    }

    // 4. Autorisierung: Der Benutzer ist authentifiziert! Jetzt stellen wir den JWT aus.
    const payload = {
      id: user.id,
      email: user.email,
    };

    const token = jwt.sign(
      payload, // Die Daten, die im Token gespeichert werden
      process.env.JWT_SECRET, // Unser geheimer Schlüssel zum Versiegeln
      { expiresIn: process.env.JWT_EXPIRES_IN } // Die Option für die Gültigkeitsdauer
    );

    // 5. Erfolg: Sende den Token an den Client. Der Client muss ihn nun für zukünftige Anfragen speichern.
    res.status(200).json({
      message: "Login erfolgreich.",
      token: token,
    });
  } catch (error) {
    console.error("Login-Fehler:", error);
    res.status(500).json({
      message: "Ein interner Fehler ist aufgetreten.",
      error: error.message,
    });
  }
};

module.exports = {
  register,
  login,
};

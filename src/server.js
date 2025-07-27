const app = require("./app");
const sequelize = require("./config/database");
require("./models/userModel");

require("dotenv").config();

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Verbindung zur Datenbank wurde erfolgreich hergestellt.");

    // Synchronisiert alle Modelle mit der DB. `alter: true` passt die Tabellen an, wenn sich Modelle ändern.
    await sequelize.sync({ alter: true });
    console.log("🔄 Alle Modelle wurden erfolgreich synchronisiert.");

    app.listen(PORT, () => {
      console.log(`🚀 Server läuft auf Port ${PORT}`);
    });
  } catch (error) {
    // Gibt das gesamte Fehlerobjekt aus, für besseres Debugging.
    console.error("❌ Start des Servers fehlgeschlagen:", error);
  }
};

startServer();

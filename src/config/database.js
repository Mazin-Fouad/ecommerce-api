const { Sequelize } = require("sequelize");

// Lade die Umgebungsvariablen aus der .env Datei.
require("dotenv").config();

// Erstelle eine neue Sequelize-Instanz. Das ist das Objekt, das unsere Verbindung zur DB darstellt.
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",

    // Logging ist extrem nützlich zum Lernen und Debuggen.
    // Es zeigt dir jeden einzelnen SQL-Befehl an, den Sequelize für dich generiert.
    logging: console.log,
  }
);

module.exports = sequelize;

const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/database");
const bcrypt = require("bcrypt");

class User extends Model {
  // NEU: Eine Instanzmethode, um das Passwort sicher zu vergleichen.
  // "this" bezieht sich auf die spezifische User-Instanz (z.B. den User "Mazin").
  async comparePassword(enteredPassword) {
    // bcrypt.compare ist die einzige sichere Methode dafür.
    // Sie nimmt das Klartext-Passwort, hasht es intern erneut mit dem gespeicherten "Salz"
    // und vergleicht das Ergebnis mit dem Hash in der Datenbank.
    return await bcrypt.compare(enteredPassword, this.password);
  }
}

User.init(
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Jede E-Mail darf nur einmal vorkommen
      validate: {
        isEmail: true, // Eingebaute Validierung von Sequelize
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true, // Muss mit der Migration übereinstimmen
    },
  },
  {
    sequelize, // Wir übergeben die Verbindungsinstanz
    modelName: "User", // Wir benennen das Modell
    tableName: "users", // Wir legen den Tabellennamen explizit fest
    hooks: {
      // Dieser Hook wird automatisch VOR dem Erstellen eines neuen Benutzers ausgeführt
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      // Dieser Hook wird VOR dem Aktualisieren eines Benutzers ausgeführt
      beforeUpdate: async (user) => {
        // Prüft, ob das Passwort-Feld geändert wurde
        if (user.changed("password")) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
  }
);

module.exports = User;

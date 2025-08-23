const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/database");

/**
 * @class Cart
 * @description Sequelize-Modell für den Warenkorb im E-Commerce System.
 * Verwaltet Warenkorb-Items für jeden Benutzer.
 */
class Cart extends Model {
  /**
   * Berechnet den Gesamtpreis des Warenkorbs
   * @returns {number} Gesamtpreis
   */
  calculateTotal() {
    return this.quantity * this.price;
  }
}

Cart.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'products',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        isInt: {
          msg: "Menge muss eine ganze Zahl sein",
        },
        min: {
          args: [1],
          msg: "Menge muss mindestens 1 sein",
        },
        max: {
          args: [999],
          msg: "Menge darf maximal 999 sein",
        },
      },
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: {
          msg: "Preis muss eine gültige Dezimalzahl sein",
        },
        min: {
          args: [0],
          msg: "Preis muss positiv sein",
        },
      },
      comment: "Preis zum Zeitpunkt der Hinzufügung zum Warenkorb",
    },
    productName: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "Produktname zum Zeitpunkt der Hinzufügung (für Konsistenz)",
    },
  },
  {
    sequelize,
    modelName: "Cart",
    tableName: "carts",
    indexes: [
      {
        name: "idx_cart_user",
        fields: ["userId"],
      },
      {
        name: "idx_cart_product",
        fields: ["productId"],
      },
      {
        name: "idx_cart_user_product",
        unique: true,
        fields: ["userId", "productId"],
      },
    ],
  }
);

module.exports = Cart;
const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/database");

/**
 * @class Product
 * @description Sequelize-Modell für Produkte im E-Commerce System.
 * Verwaltet alle produktbezogenen Daten und Validierungen.
 */
class Product extends Model {
  /**
   * Formatiert den Preis für die Anzeige
   * @returns {string} Formatierter Preis mit Währungssymbol
   */
  getFormattedPrice() {
    return `€${this.price.toFixed(2)}`;
  }

  /**
   * Prüft ob das Produkt verfügbar ist
   * @returns {boolean} Verfügbarkeitsstatus
   */
  isAvailable() {
    return this.stock > 0 && this.isActive;
  }
}

Product.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Produktname darf nicht leer sein",
        },
        len: {
          args: [2, 100],
          msg: "Produktname muss zwischen 2 und 100 Zeichen lang sein",
        },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: {
          args: [0, 1000],
          msg: "Beschreibung darf maximal 1000 Zeichen lang sein",
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
    },
    comparePrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: {
        isDecimal: {
          msg: "Vergleichspreis muss eine gültige Dezimalzahl sein",
        },
        min: {
          args: [0],
          msg: "Vergleichspreis muss positiv sein",
        },
      },
    },
    sku: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: "SKU darf nicht leer sein",
        },
      },
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        isInt: {
          msg: "Lagerbestand muss eine ganze Zahl sein",
        },
        min: {
          args: [0],
          msg: "Lagerbestand kann nicht negativ sein",
        },
      },
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: {
          args: [0, 50],
          msg: "Kategorie darf maximal 50 Zeichen lang sein",
        },
      },
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: {
          args: [0, 50],
          msg: "Marke darf maximal 50 Zeichen lang sein",
        },
      },
    },
    images: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
      comment: "Array von Bild-URLs",
    },
    weight: {
      type: DataTypes.DECIMAL(8, 3),
      allowNull: true,
      validate: {
        isDecimal: {
          msg: "Gewicht muss eine gültige Dezimalzahl sein",
        },
        min: {
          args: [0],
          msg: "Gewicht muss positiv sein",
        },
      },
      comment: "Gewicht in Kilogramm",
    },
    dimensions: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: "Abmessungen als JSON: {length, width, height} in cm",
    },
    tags: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
      comment: "Array von Tags für Suche und Filterung",
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: "Produkt ist aktiv und sichtbar",
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: "Produkt als Featured markiert",
    },
    seoTitle: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: {
          args: [0, 60],
          msg: "SEO-Titel darf maximal 60 Zeichen lang sein",
        },
      },
    },
    seoDescription: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: {
          args: [0, 160],
          msg: "SEO-Beschreibung darf maximal 160 Zeichen lang sein",
        },
      },
    },
  },
  {
    sequelize,
    modelName: "Product",
    tableName: "products",
    indexes: [
      {
        name: "idx_product_sku",
        unique: true,
        fields: ["sku"],
      },
      {
        name: "idx_product_category",
        fields: ["category"],
      },
      {
        name: "idx_product_active",
        fields: ["isActive"],
      },
      {
        name: "idx_product_featured",
        fields: ["isFeatured"],
      },
      {
        name: "idx_product_price",
        fields: ["price"],
      },
    ],
  }
);

module.exports = Product;
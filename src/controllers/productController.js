const { Op } = require("sequelize");
const Product = require("../models/productModel");

/**
 * @module ProductController
 * @description Controller für alle produktbezogenen Operationen.
 * Verwaltet Produktkatalog, Suche und Filterung.
 */

/**
 * Ruft alle Produkte ab mit optionaler Filterung
 * @async
 * @function getAllProducts
 * @description Liefert alle aktiven Produkte mit Paginierung und Filteroptionen
 * @param {Object} req - Express Request Objekt
 * @param {Object} req.query.page - Seitennummer für Paginierung
 * @param {Object} req.query.limit - Anzahl Produkte pro Seite
 * @param {Object} req.query.category - Filterung nach Kategorie
 * @param {Object} req.query.minPrice - Minimaler Preis
 * @param {Object} req.query.maxPrice - Maximaler Preis
 * @param {Object} req.query.search - Suchbegriff
 * @param {Object} res - Express Response Objekt
 * @returns {Object} 200 - Liste der Produkte mit Paginierungsinfo
 */
const getAllProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      minPrice,
      maxPrice,
      search,
      featured,
    } = req.query;

    let products = [];
    let count = 0;
    let isUsingMockData = false;

    try {
      // Paginierung berechnen
      const offset = (page - 1) * limit;
      
      // Filter-Bedingungen aufbauen
      const whereConditions = {
        isActive: true,
      };

      if (category) {
        whereConditions.category = category;
      }

      if (featured !== undefined) {
        whereConditions.isFeatured = featured === 'true';
      }

      if (minPrice || maxPrice) {
        whereConditions.price = {};
        if (minPrice) whereConditions.price[Op.gte] = parseFloat(minPrice);
        if (maxPrice) whereConditions.price[Op.lte] = parseFloat(maxPrice);
      }

      if (search) {
        whereConditions[Op.or] = [
          { name: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } },
          { tags: { [Op.like]: `%${search}%` } },
        ];
      }

      // Produkte aus Datenbank abrufen
      const result = await Product.findAndCountAll({
        where: whereConditions,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', 'DESC']],
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      });
      
      products = result.rows;
      count = result.count;
    } catch (dbError) {
      // Fallback auf Mock-Daten wenn Datenbank nicht verfügbar
      console.log("Datenbank nicht verfügbar, verwende Mock-Daten");
      isUsingMockData = true;
      
      const mockProducts = require("../products.json");
      let filteredProducts = [...mockProducts];

      // Mock-Filter anwenden
      if (category) {
        filteredProducts = filteredProducts.filter(p => 
          p.category && p.category.toLowerCase() === category.toLowerCase()
        );
      }

      if (minPrice) {
        filteredProducts = filteredProducts.filter(p => p.price >= parseFloat(minPrice));
      }

      if (maxPrice) {
        filteredProducts = filteredProducts.filter(p => p.price <= parseFloat(maxPrice));
      }

      if (search) {
        const searchLower = search.toLowerCase();
        filteredProducts = filteredProducts.filter(p => 
          p.name.toLowerCase().includes(searchLower) ||
          (p.description && p.description.toLowerCase().includes(searchLower))
        );
      }

      count = filteredProducts.length;
      
      // Mock-Paginierung
      const offset = (page - 1) * limit;
      products = filteredProducts.slice(offset, offset + parseInt(limit));
    }

    // Paginierungsinfo berechnen
    const totalPages = Math.ceil(count / limit);
    
    res.status(200).json({
      message: `Produkte erfolgreich abgerufen${isUsingMockData ? ' (Mock-Daten)' : ''}`,
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalProducts: count,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Fehler beim Abrufen der Produkte:", error);
    res.status(500).json({
      message: "Fehler beim Abrufen der Produkte",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Ruft ein einzelnes Produkt nach ID ab
 * @async
 * @function getProductById
 * @description Liefert Produktdetails für eine spezifische ID
 * @param {Object} req - Express Request Objekt
 * @param {string} req.params.id - Produkt ID
 * @param {Object} res - Express Response Objekt
 * @returns {Object} 200 - Produktdetails
 * @returns {Object} 404 - Produkt nicht gefunden
 */
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    let product = null;
    let isUsingMockData = false;

    try {
      // Produkt aus Datenbank suchen
      product = await Product.findOne({
        where: { 
          id,
          isActive: true 
        },
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      });
    } catch (dbError) {
      console.log("Datenbank nicht verfügbar, verwende Mock-Daten");
      isUsingMockData = true;
    }

    if (!product) {
      // Fallback auf Mock-Daten
      const mockProducts = require("../products.json");
      const productId = parseInt(id, 10);
      const mockProduct = mockProducts.find((p) => p.id === productId);

      if (!mockProduct) {
        return res.status(404).json({
          message: "Produkt nicht gefunden",
        });
      }

      return res.status(200).json({
        message: "Produkt erfolgreich abgerufen (Mock-Daten)",
        product: mockProduct,
      });
    }

    res.status(200).json({
      message: `Produkt erfolgreich abgerufen${isUsingMockData ? ' (Mock-Daten)' : ''}`,
      product,
    });
  } catch (error) {
    console.error("Fehler beim Abrufen des Produkts:", error);
    res.status(500).json({
      message: "Fehler beim Abrufen des Produkts",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
};

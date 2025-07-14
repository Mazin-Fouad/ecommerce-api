const mockProducts = [
  { id: 1, name: "Laptop Pro", price: 1200 },
  { id: 2, name: "Wireless Maus", price: 50 },
  { id: 3, name: "Mechanische Tastatur", price: 150 },
];

const getAllProducts = (req, res) => {
  try {
    res.status(200).json({
      message: "Produkte erfolgreich abgerufen",
      products: mockProducts,
    });
  } catch (error) {
    res.status(500).json({
      message: "Fehler beim Abrufen der Produkte",
      error: error.message,
    });
  }
};

const getProductById = (req, res) => {
  try {
    const productId = parseInt(req.params.id, 10);
    const product = mockProducts.find((p) => p.id === productId);

    if (!product) {
      return res.status(404).json({
        message: "Produkt nicht gefunden",
      });
    }

    res.status(200).json({
      message: "Produkt erfolgreich abgerufen",
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: "Fehler beim Abrufen des Produkts",
      error: error.message,
    });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
};

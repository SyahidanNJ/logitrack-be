const { db } = require("../../config/sequelize");

const getAll = async (filters = {}) => {
  // Ponytail: minimal implementation
  if (db.logitrack.TrStockMovement) {
      return await db.logitrack.TrStockMovement.findAll({ where: filters });
  }
  return [];
};

module.exports = { getAll };

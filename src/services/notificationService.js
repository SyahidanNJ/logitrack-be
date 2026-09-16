const { db } = require("../../config/sequelize");

const getAll = async (filters = {}) => {
  // Ponytail: minimal implementation
  if (db.logitrack.TrNotification) {
      return await db.logitrack.TrNotification.findAll({ where: filters });
  }
  return [];
};

module.exports = { getAll };

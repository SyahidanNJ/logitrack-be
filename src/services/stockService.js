const { db } = require("../../config/sequelize");

const getAll = async (filters = {}) => {
  return await db.logitrack.TrStock.findAll({
    where: { ...filters },
    include: [
      { model: db.logitrack.MstProduct, as: "Product", attributes: ["id", "sku", "name"] },
      { model: db.logitrack.MstBinLocation, as: "BinLocation", attributes: ["id", "code"] }
    ],
    order: [["created_at", "DESC"]],
  });
};

const getById = async (id) => {
  return await db.logitrack.TrStock.findByPk(id);
};

const create = async (data) => {
  return await db.logitrack.TrStock.create(data);
};

const update = async (id, data) => {
  const record = await db.logitrack.TrStock.findByPk(id);
  if (!record) return null;
  return await record.update(data);
};

const remove = async (id) => {
  const record = await db.logitrack.TrStock.findByPk(id);
  if (!record) return null;
  if (record.is_active !== undefined) return await record.update({ is_active: false });
  return await record.destroy();
};

module.exports = { getAll, getById, create, update, remove };

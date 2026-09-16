const { db } = require("../../config/sequelize");

const getAll = async (filters = {}) => {
  return await db.logitrack.MstWarehouse.findAll({
    where: { is_active: true, ...filters },
    order: [["created_at", "DESC"]],
  });
};

const getById = async (id) => {
  return await db.logitrack.MstWarehouse.findOne({
    where: { id, is_active: true },
    include: [
      {
        model: db.logitrack.MstZone,
        as: "Zones",
        where: { is_active: true },
        required: false,
      }
    ]
  });
};

const create = async (data) => {
  return await db.logitrack.MstWarehouse.create(data);
};

const update = async (id, data) => {
  const warehouse = await db.logitrack.MstWarehouse.findByPk(id);
  if (!warehouse) return null;
  
  return await warehouse.update(data);
};

const remove = async (id) => {
  const warehouse = await db.logitrack.MstWarehouse.findByPk(id);
  if (!warehouse) return null;
  
  // Soft delete
  return await warehouse.update({ is_active: false });
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};

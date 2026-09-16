const { db } = require("../../config/sequelize");

const getAll = async (filters = {}) => {
  return await db.logitrack.MstZone.findAll({
    where: { is_active: true, ...filters },
    include: [
      {
        model: db.logitrack.MstWarehouse,
        as: "Warehouse",
        attributes: ["name", "code"]
      }
    ],
    order: [["created_at", "DESC"]],
  });
};

const getById = async (id) => {
  return await db.logitrack.MstZone.findOne({
    where: { id, is_active: true },
    include: [
      {
        model: db.logitrack.MstWarehouse,
        as: "Warehouse",
        attributes: ["name", "code"]
      }
    ]
  });
};

const create = async (data) => {
  return await db.logitrack.MstZone.create(data);
};

const update = async (id, data) => {
  const zone = await db.logitrack.MstZone.findByPk(id);
  if (!zone) return null;
  
  return await zone.update(data);
};

const remove = async (id) => {
  const zone = await db.logitrack.MstZone.findByPk(id);
  if (!zone) return null;
  
  // Soft delete
  return await zone.update({ is_active: false });
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};

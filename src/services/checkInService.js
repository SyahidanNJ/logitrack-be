const { db } = require("../../config/sequelize");

const getAll = async (filters = {}) => {
  return await db.logitrack.TrCheckIn.findAll({
    where: { ...filters },
    include: [
      { model: db.logitrack.MstProduct, as: "Product", attributes: ["id", "sku", "name"] },
      { model: db.logitrack.MstBinLocation, as: "BinLocation", attributes: ["id", "code"] }
    ],
    order: [["created_at", "DESC"]],
  });
};

const getById = async (id) => {
  return await db.logitrack.TrCheckIn.findByPk(id);
};

const create = async (data) => {
  const t = await db.sequelizeLogitrack.transaction();
  try {
    // 1. Create the Check-In record
    const checkIn = await db.logitrack.TrCheckIn.create(data, { transaction: t });

    // 2. Find or Create Stock
    const [stock, created] = await db.logitrack.TrStock.findOrCreate({
      where: {
        product_id: data.product_id,
        bin_location_id: data.bin_location_id,
        batch_number: data.batch_number
      },
      defaults: {
        expiry_date: data.expiry_date,
        quantity: 0
      },
      transaction: t
    });

    // 3. Increment Stock Quantity
    await stock.increment('quantity', { by: data.quantity, transaction: t });

    // 4. Log Movement
    await db.logitrack.TrStockMovement.create({
      product_id: data.product_id,
      batch_number: data.batch_number,
      bin_location_id: data.bin_location_id,
      movement_type: 'IN',
      quantity: data.quantity,
      reference_type: 'CHECK_IN',
      reference_id: checkIn.id,
      performed_by: data.performed_by || 1,
      notes: data.notes
    }, { transaction: t });

    await t.commit();
    return checkIn;
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

const update = async (id, data) => {
  const record = await db.logitrack.TrCheckIn.findByPk(id);
  if (!record) return null;
  return await record.update(data);
};

const remove = async (id) => {
  const record = await db.logitrack.TrCheckIn.findByPk(id);
  if (!record) return null;
  if (record.is_active !== undefined) return await record.update({ is_active: false });
  return await record.destroy();
};

module.exports = { getAll, getById, create, update, remove };

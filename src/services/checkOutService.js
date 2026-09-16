const { db } = require("../../config/sequelize");

const getAll = async (filters = {}) => {
  return await db.logitrack.TrCheckOut.findAll({
    where: { ...filters },
    include: [
      { model: db.logitrack.MstProduct, as: "Product", attributes: ["id", "sku", "name"] }
    ],
    order: [["created_at", "DESC"]],
  });
};

const getById = async (id) => {
  return await db.logitrack.TrCheckOut.findByPk(id);
};

const create = async (data) => {
  const { Op } = require('sequelize');
  const t = await db.sequelizeLogitrack.transaction();
  try {
    const qtyRequested = parseInt(data.quantity, 10);
    if (qtyRequested <= 0) throw new Error("Quantity must be greater than 0");

    // Check available stock
    const stocks = await db.logitrack.TrStock.findAll({
      where: {
        product_id: data.product_id,
        quantity: { [Op.gt]: 0 }
      },
      order: [
        data.strategy === 'FEFO' ? ['expiry_date', 'ASC'] : ['created_at', 'ASC']
      ],
      transaction: t,
      lock: true
    });

    const totalAvailable = stocks.reduce((sum, s) => sum + s.quantity, 0);
    if (totalAvailable < qtyRequested) {
      throw new Error(`Insufficient stock. Available: ${totalAvailable}, Requested: ${qtyRequested}`);
    }

    // Create Check-Out record
    const checkOut = await db.logitrack.TrCheckOut.create({
      product_id: data.product_id,
      quantity: qtyRequested,
      strategy: data.strategy,
      destination: data.destination,
      document_number: data.document_number,
      document_file: data.document_file,
      notes: data.notes,
      performed_by: data.performed_by || 1,
      status: 'completed'
    }, { transaction: t });

    let remainingQty = qtyRequested;

    for (const stock of stocks) {
      if (remainingQty <= 0) break;

      const takeQty = Math.min(stock.quantity, remainingQty);
      
      // Update stock
      await stock.decrement('quantity', { by: takeQty, transaction: t });

      // Create detail
      await db.logitrack.TrCheckOutDetail.create({
        check_out_id: checkOut.id,
        stock_id: stock.id,
        batch_number: stock.batch_number,
        expiry_date: stock.expiry_date,
        quantity_taken: takeQty,
        bin_location_id: stock.bin_location_id
      }, { transaction: t });

      // Log movement
      await db.logitrack.TrStockMovement.create({
        product_id: data.product_id,
        batch_number: stock.batch_number,
        bin_location_id: stock.bin_location_id,
        movement_type: 'OUT',
        quantity: takeQty,
        reference_type: 'CHECK_OUT',
        reference_id: checkOut.id,
        performed_by: data.performed_by || 1,
        notes: data.notes
      }, { transaction: t });

      remainingQty -= takeQty;
    }

    await t.commit();
    return checkOut;
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

const update = async (id, data) => {
  const record = await db.logitrack.TrCheckOut.findByPk(id);
  if (!record) return null;
  return await record.update(data);
};

const remove = async (id) => {
  const record = await db.logitrack.TrCheckOut.findByPk(id);
  if (!record) return null;
  if (record.is_active !== undefined) return await record.update({ is_active: false });
  return await record.destroy();
};

module.exports = { getAll, getById, create, update, remove };

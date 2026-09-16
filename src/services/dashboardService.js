const { db } = require("../../config/sequelize");

const getStats = async () => {
  const totalProducts = await db.logitrack.MstProduct.count();
  const totalWarehouses = await db.logitrack.MstWarehouse.count();
  const totalZones = await db.logitrack.MstZone.count();
  
  // Aggregate total stock quantity
  const stockResult = await db.logitrack.TrStock.sum('quantity');
  const totalStocks = stockResult || 0;
  
  const totalCheckIns = await db.logitrack.TrCheckIn.count();
  const totalCheckOuts = await db.logitrack.TrCheckOut.count();
  
  // Get recent stock movements (last 5)
  const recentMovements = await db.logitrack.TrStockMovement.findAll({
    include: [
      { model: db.logitrack.MstProduct, as: "Product", attributes: ["name", "sku"] },
      { model: db.logitrack.MstBinLocation, as: "BinLocation", attributes: ["code"] }
    ],
    order: [["created_at", "DESC"]],
    limit: 5
  });

  // Get low stock alerts (lowest 5 quantities > 0)
  const lowStocks = await db.logitrack.TrStock.findAll({
    where: {
      quantity: { [db.Sequelize.Op.gt]: 0 }
    },
    include: [
      { model: db.logitrack.MstProduct, as: "Product", attributes: ["name", "sku"] },
      { model: db.logitrack.MstBinLocation, as: "BinLocation", attributes: ["code"] }
    ],
    order: [["quantity", "ASC"]],
    limit: 5
  });

  return {
    totalProducts,
    totalWarehouses,
    totalZones,
    totalStocks,
    totalCheckIns,
    totalCheckOuts,
    recentMovements,
    lowStocks
  };
};

const getAll = async (filters = {}) => {
  return await getStats();
};

module.exports = { getAll, getStats };

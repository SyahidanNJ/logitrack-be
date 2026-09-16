"use strict";
module.exports = (sequelize, DataTypes) => {
  const TrStockMovement = sequelize.define("TrStockMovement", {
    id:              { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    product_id:      { type: DataTypes.BIGINT, allowNull: false },
    batch_number:    { type: DataTypes.STRING(100), allowNull: false },
    bin_location_id: { type: DataTypes.BIGINT, allowNull: false },
    movement_type:   { type: DataTypes.ENUM("IN", "OUT", "ADJUSTMENT", "TRANSFER"), allowNull: false },
    quantity:        { type: DataTypes.INTEGER, allowNull: false },
    reference_type:  { type: DataTypes.STRING(50), allowNull: false }, // "check_in", "check_out", "adjustment"
    reference_id:    { type: DataTypes.BIGINT, allowNull: false },
    performed_by:    { type: DataTypes.BIGINT, allowNull: false },
    notes:           { type: DataTypes.TEXT, allowNull: true },
  }, {
    tableName: "tr_stock_movements",
    underscored: true,
    timestamps: true,
    updatedAt: false,
  });
  TrStockMovement.associate = (models) => {
    TrStockMovement.belongsTo(models.MstProduct,     { foreignKey: "product_id", as: "Product" });
    TrStockMovement.belongsTo(models.MstBinLocation, { foreignKey: "bin_location_id", as: "BinLocation" });
    TrStockMovement.belongsTo(models.MstUsers,       { foreignKey: "performed_by", as: "Performer" });
  };
  return TrStockMovement;
};

"use strict";
module.exports = (sequelize, DataTypes) => {
  const MstStockAlert = sequelize.define("MstStockAlert", {
    id:                   { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    product_id:           { type: DataTypes.BIGINT, allowNull: false, unique: true },
    min_stock_threshold:  { type: DataTypes.INTEGER, allowNull: false, defaultValue: 10 },
    expiry_warning_days:  { type: DataTypes.INTEGER, allowNull: false, defaultValue: 30 },
  }, {
    tableName: "mst_stock_alerts",
    underscored: true,
    timestamps: true,
  });
  MstStockAlert.associate = (models) => {
    MstStockAlert.belongsTo(models.MstProduct, { foreignKey: "product_id", as: "Product" });
  };
  return MstStockAlert;
};

"use strict";
module.exports = (sequelize, DataTypes) => {
  const TrStock = sequelize.define("TrStock", {
    id:              { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    product_id:      { type: DataTypes.BIGINT, allowNull: false },
    bin_location_id: { type: DataTypes.BIGINT, allowNull: false },
    batch_number:    { type: DataTypes.STRING(100), allowNull: false },
    expiry_date:     { type: DataTypes.DATEONLY, allowNull: false },
    quantity:        { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  }, {
    tableName: "tr_stocks",
    underscored: true,
    timestamps: true,
    indexes: [
      { unique: true, fields: ["product_id", "bin_location_id", "batch_number"] },
    ],
  });
  TrStock.associate = (models) => {
    TrStock.belongsTo(models.MstProduct,     { foreignKey: "product_id", as: "Product" });
    TrStock.belongsTo(models.MstBinLocation, { foreignKey: "bin_location_id", as: "BinLocation" });
  };
  return TrStock;
};

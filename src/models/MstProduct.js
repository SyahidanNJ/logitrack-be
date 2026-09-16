"use strict";
module.exports = (sequelize, DataTypes) => {
  const MstProduct = sequelize.define("MstProduct", {
    id:          { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    sku:         { type: DataTypes.STRING(50), unique: true, allowNull: false },
    name:        { type: DataTypes.STRING(200), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    category: { 
      type: DataTypes.ENUM(
        "F&B (Makanan & Minuman)", 
        "Fashion & Tekstil", 
        "Stationery & Cetakan", 
        "Elektronik & Gadget"
      ), 
      allowNull: true 
    },
    unit: {
      type: DataTypes.ENUM("pcs", "kg", "liter", "box", "pallet"),
      defaultValue: "pcs",
    },
    is_active:   { type: DataTypes.BOOLEAN, defaultValue: true },
  }, {
    tableName: "mst_products",
    underscored: true,
    timestamps: true,
  });
  MstProduct.associate = (models) => {
    MstProduct.hasMany(models.TrStock,      { foreignKey: "product_id", as: "Stocks" });
    MstProduct.hasOne(models.MstStockAlert, { foreignKey: "product_id", as: "AlertConfig" });
  };
  return MstProduct;
};

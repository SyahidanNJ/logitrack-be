"use strict";
module.exports = (sequelize, DataTypes) => {
  const TrCheckOutDetail = sequelize.define("TrCheckOutDetail", {
    id:              { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    check_out_id:    { type: DataTypes.BIGINT, allowNull: false },
    stock_id:        { type: DataTypes.BIGINT, allowNull: false },
    batch_number:    { type: DataTypes.STRING(100), allowNull: false },
    expiry_date:     { type: DataTypes.DATEONLY, allowNull: false },
    quantity_taken:  { type: DataTypes.INTEGER, allowNull: false },
    bin_location_id: { type: DataTypes.BIGINT, allowNull: false },
  }, {
    tableName: "tr_check_out_details",
    underscored: true,
    timestamps: true,
    updatedAt: false,
  });
  TrCheckOutDetail.associate = (models) => {
    TrCheckOutDetail.belongsTo(models.TrCheckOut,    { foreignKey: "check_out_id", as: "CheckOut" });
    TrCheckOutDetail.belongsTo(models.TrStock,       { foreignKey: "stock_id", as: "Stock" });
    TrCheckOutDetail.belongsTo(models.MstBinLocation,{ foreignKey: "bin_location_id", as: "BinLocation" });
  };
  return TrCheckOutDetail;
};

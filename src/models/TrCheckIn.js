"use strict";
module.exports = (sequelize, DataTypes) => {
  const TrCheckIn = sequelize.define("TrCheckIn", {
    id:              { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    product_id:      { type: DataTypes.BIGINT, allowNull: false },
    bin_location_id: { type: DataTypes.BIGINT, allowNull: false },
    batch_number:    { type: DataTypes.STRING(100), allowNull: false },
    expiry_date:     { type: DataTypes.DATEONLY, allowNull: false },
    quantity:        { type: DataTypes.INTEGER, allowNull: false },
    supplier_info:   { type: DataTypes.STRING(255), allowNull: true },
    document_number: { type: DataTypes.STRING(100), allowNull: true },
    document_file:   { type: DataTypes.STRING(255), allowNull: true },
    notes:           { type: DataTypes.TEXT, allowNull: true },
    performed_by:    { type: DataTypes.BIGINT, allowNull: false },
    status: {
      type: DataTypes.ENUM("completed", "cancelled"),
      defaultValue: "completed",
    },
  }, {
    tableName: "tr_check_ins",
    underscored: true,
    timestamps: true,
    updatedAt: false,
  });
  TrCheckIn.associate = (models) => {
    TrCheckIn.belongsTo(models.MstProduct,     { foreignKey: "product_id", as: "Product" });
    TrCheckIn.belongsTo(models.MstBinLocation, { foreignKey: "bin_location_id", as: "BinLocation" });
    TrCheckIn.belongsTo(models.MstUsers,       { foreignKey: "performed_by", as: "Performer" });
  };
  return TrCheckIn;
};

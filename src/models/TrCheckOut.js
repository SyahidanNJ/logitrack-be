"use strict";
module.exports = (sequelize, DataTypes) => {
  const TrCheckOut = sequelize.define("TrCheckOut", {
    id:           { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    product_id:   { type: DataTypes.BIGINT, allowNull: false },
    quantity:     { type: DataTypes.INTEGER, allowNull: false },
    strategy:     { type: DataTypes.ENUM("FIFO", "FEFO"), allowNull: false, defaultValue: "FIFO" },
    destination:  { type: DataTypes.STRING(255), allowNull: true },
    document_number: { type: DataTypes.STRING(100), allowNull: true },
    document_file:   { type: DataTypes.STRING(255), allowNull: true },
    notes:        { type: DataTypes.TEXT, allowNull: true },
    performed_by: { type: DataTypes.BIGINT, allowNull: false },
    status: {
      type: DataTypes.ENUM("completed", "cancelled"),
      defaultValue: "completed",
    },
  }, {
    tableName: "tr_check_outs",
    underscored: true,
    timestamps: true,
    updatedAt: false,
  });
  TrCheckOut.associate = (models) => {
    TrCheckOut.belongsTo(models.MstProduct, { foreignKey: "product_id", as: "Product" });
    TrCheckOut.belongsTo(models.MstUsers,   { foreignKey: "performed_by", as: "Performer" });
    TrCheckOut.hasMany(models.TrCheckOutDetail, { foreignKey: "check_out_id", as: "Details" });
  };
  return TrCheckOut;
};

"use strict";
module.exports = (sequelize, DataTypes) => {
  const MstWarehouse = sequelize.define("MstWarehouse", {
    id:        { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    code:      { type: DataTypes.STRING(20), unique: true, allowNull: false },
    name:      { type: DataTypes.STRING(100), allowNull: false },
    address:   { type: DataTypes.TEXT, allowNull: true },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  }, {
    tableName: "mst_warehouses",
    underscored: true,
    timestamps: true,
  });
  MstWarehouse.associate = (models) => {
    MstWarehouse.hasMany(models.MstZone, { foreignKey: "warehouse_id", as: "Zones" });
  };
  return MstWarehouse;
};

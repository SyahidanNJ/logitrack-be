"use strict";
module.exports = (sequelize, DataTypes) => {
  const MstZone = sequelize.define("MstZone", {
    id:           { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    warehouse_id: { type: DataTypes.BIGINT, allowNull: false },
    code:         { type: DataTypes.STRING(20), allowNull: false },
    name:         { type: DataTypes.STRING(100), allowNull: false },
    type: {
      type: DataTypes.ENUM("inbound", "outbound", "storage", "quarantine", "staging"),
      defaultValue: "storage",
    },
    is_active:    { type: DataTypes.BOOLEAN, defaultValue: true },
  }, {
    tableName: "mst_zones",
    underscored: true,
    timestamps: true,
  });
  MstZone.associate = (models) => {
    MstZone.belongsTo(models.MstWarehouse,  { foreignKey: "warehouse_id", as: "Warehouse" });
    MstZone.hasMany(models.MstBinLocation,  { foreignKey: "zone_id", as: "Bins" });
  };
  return MstZone;
};

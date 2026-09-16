"use strict";
module.exports = (sequelize, DataTypes) => {
  const MstBinLocation = sequelize.define("MstBinLocation", {
    id:            { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    zone_id:       { type: DataTypes.BIGINT, allowNull: false },
    code:          { type: DataTypes.STRING(30), allowNull: false },
    label:         { type: DataTypes.STRING(100), allowNull: true },
    max_capacity:  { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1000 },
    current_load:  { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    is_active:     { type: DataTypes.BOOLEAN, defaultValue: true },
  }, {
    tableName: "mst_bin_locations",
    underscored: true,
    timestamps: true,
  });
  MstBinLocation.associate = (models) => {
    MstBinLocation.belongsTo(models.MstZone, { foreignKey: "zone_id", as: "Zone" });
    MstBinLocation.hasMany(models.TrStock,   { foreignKey: "bin_location_id", as: "Stocks" });
  };
  return MstBinLocation;
};

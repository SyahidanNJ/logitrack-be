"use strict";
module.exports = (sequelize, DataTypes) => {
  const MstUsers = sequelize.define("MstUsers", {
    id:            { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    nik:           { type: DataTypes.STRING(20), unique: true, allowNull: false },
    name:          { type: DataTypes.STRING(100), allowNull: false },
    email:         { type: DataTypes.STRING(100), allowNull: true },
    password_hash: { type: DataTypes.STRING(255), allowNull: false },
    department:    { type: DataTypes.STRING(100), allowNull: true },
    role: {
      type: DataTypes.ENUM("admin", "superadmin", "driver"),
      defaultValue: "admin",
    },
    is_active:     { type: DataTypes.BOOLEAN, defaultValue: true },
  }, {
    tableName: "mst_users",
    underscored: true,
    timestamps: true,
    updatedAt: false,
  });
  MstUsers.associate = (models) => {
    MstUsers.hasMany(models.TrCheckIn,       { foreignKey: "performed_by", as: "checkIns" });
    MstUsers.hasMany(models.TrCheckOut,      { foreignKey: "performed_by", as: "checkOuts" });
    MstUsers.hasMany(models.TrNotification,  { foreignKey: "user_id", as: "notifications" });
  };
  return MstUsers;
};

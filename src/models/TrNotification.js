"use strict";
module.exports = (sequelize, DataTypes) => {
  const TrNotification = sequelize.define("TrNotification", {
    id:      { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.BIGINT, allowNull: false },
    title:   { type: DataTypes.STRING(255), allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: true },
    type: {
      type: DataTypes.ENUM("low_stock", "expiry_warning", "expired", "check_in", "check_out", "system"),
      allowNull: false,
    },
    is_read: { type: DataTypes.BOOLEAN, defaultValue: false },
  }, {
    tableName: "tr_notifications",
    underscored: true,
    timestamps: true,
    updatedAt: "updated_at",
  });
  TrNotification.associate = (models) => {
    TrNotification.belongsTo(models.MstUsers, { foreignKey: "user_id", as: "Recipient" });
  };
  return TrNotification;
};

  module.exports = (sequelize, DataTypes) => {
  const MstDepartment = sequelize.define(
    "MstDepartment",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      code: { type: DataTypes.STRING(20), allowNull: false, unique: true },
      name: { type: DataTypes.STRING(100), allowNull: false },
    },
    {
      tableName: "mst_departments",
      timestamps: true,
      underscored: true,
    }
  );

  return MstDepartment;
};

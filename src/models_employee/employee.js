"use strict";
module.exports = (sequelize, DataTypes) => {
  const Employee = sequelize.define("Employee", {
    id:            { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    nik:           { type: DataTypes.STRING(50), unique: true, allowNull: false },
    name:          { type: DataTypes.STRING(150), allowNull: false },
    email:         { type: DataTypes.STRING(150), unique: true, allowNull: false },
    department_id: { type: DataTypes.INTEGER, allowNull: true },
    role:          { type: DataTypes.STRING(50) },
    password:      { type: DataTypes.STRING(255), allowNull: false },
  }, {
    tableName: "mst_employees",
    underscored: true,
    timestamps: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
  });
  
  return Employee;
};

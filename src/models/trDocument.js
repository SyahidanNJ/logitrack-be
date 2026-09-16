"use strict";
module.exports = (sequelize, DataTypes) => {
  const TrDocument = sequelize.define("TrDocument", {
    id:           { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    doc_number:   { type: DataTypes.STRING(100), allowNull: false, unique: true },
    doc_type:     { type: DataTypes.ENUM("CHECK_IN", "CHECK_OUT"), allowNull: false },
    reference_id: { type: DataTypes.BIGINT, allowNull: false },
    status:       { type: DataTypes.ENUM("GENERATED", "PRINTED", "CANCELLED"), defaultValue: "GENERATED" },
    generated_by: { type: DataTypes.BIGINT, allowNull: false },
  }, {
    tableName: "tr_documents",
    underscored: true,
    timestamps: true,
  });
  
  TrDocument.associate = (models) => {
    TrDocument.belongsTo(models.MstUsers, { foreignKey: "generated_by", as: "Generator" });
    // We will loosely couple the reference_id since it can be either check_in or check_out.
    // However, for Sequelize relations we can define them as conditionally joined, or just fetch manually.
  };
  
  return TrDocument;
};

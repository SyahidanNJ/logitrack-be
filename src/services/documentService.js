const { db } = require("../../config/sequelize");

const getAll = async (filters = {}) => {
  const docs = await db.logitrack.TrDocument.findAll({
    where: { ...filters },
    include: [
      { model: db.logitrack.MstUsers, as: "Generator", attributes: ["id", "name", "email"] }
    ],
    order: [["created_at", "DESC"]],
    raw: true,
    nest: true
  });
  
  // Attach reference data manually since it's polymorphic
  for (let doc of docs) {
    if (doc.doc_type === 'CHECK_IN') {
      doc.CheckIn = await db.logitrack.TrCheckIn.findByPk(doc.reference_id, {
        include: [{ model: db.logitrack.MstProduct, as: "Product", attributes: ["sku", "name"] }]
      });
    } else {
      doc.CheckOut = await db.logitrack.TrCheckOut.findByPk(doc.reference_id, {
        include: [{ model: db.logitrack.MstProduct, as: "Product", attributes: ["sku", "name"] }]
      });
    }
  }
  return docs;
};

const getById = async (id) => {
  const doc = await db.logitrack.TrDocument.findByPk(id, {
    include: [
      { model: db.logitrack.MstUsers, as: "Generator", attributes: ["id", "name", "email"] }
    ],
    raw: true,
    nest: true
  });
  
  if (doc) {
    if (doc.doc_type === 'CHECK_IN') {
      doc.CheckIn = await db.logitrack.TrCheckIn.findByPk(doc.reference_id, {
        include: [
          { model: db.logitrack.MstProduct, as: "Product" },
          { model: db.logitrack.MstBinLocation, as: "BinLocation" }
        ]
      });
    } else {
      doc.CheckOut = await db.logitrack.TrCheckOut.findByPk(doc.reference_id, {
        include: [
          { model: db.logitrack.MstProduct, as: "Product" },
          { model: db.logitrack.TrCheckOutDetail, as: "Details", include: [{ model: db.logitrack.MstBinLocation, as: "BinLocation" }] }
        ]
      });
    }
  }
  return doc;
};

const create = async (data) => {
  // Generate a unique doc number based on type and date
  const prefix = data.doc_type === 'CHECK_IN' ? 'DOC-IN' : 'DOC-OUT';
  const dateStr = new Date().toISOString().slice(0,10).replace(/-/g, '');
  const rand = Math.floor(1000 + Math.random() * 9000);
  data.doc_number = `${prefix}-${dateStr}-${rand}`;
  
  return await db.logitrack.TrDocument.create(data);
};

const update = async (id, data) => {
  const record = await db.logitrack.TrDocument.findByPk(id);
  if (!record) return null;
  return await record.update(data);
};

const remove = async (id) => {
  const record = await db.logitrack.TrDocument.findByPk(id);
  if (!record) return null;
  return await record.destroy();
};

module.exports = { getAll, getById, create, update, remove };

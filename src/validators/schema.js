const Joi = require("joi");

const createWarehouseSchema = Joi.object({
  code: Joi.string().max(20).required(),
  name: Joi.string().max(100).required(),
  address: Joi.string().allow(null, ""),
});

const updateWarehouseSchema = Joi.object({
  code: Joi.string().max(20),
  name: Joi.string().max(100),
  address: Joi.string().allow(null, ""),
  is_active: Joi.boolean()
});

const createZoneSchema = Joi.object({
  warehouse_id: Joi.number().required(),
  code: Joi.string().max(20).required(),
  name: Joi.string().max(100).required(),
  type: Joi.string().valid("inbound", "outbound", "storage", "quarantine", "staging").required(),
});

const updateZoneSchema = Joi.object({
  warehouse_id: Joi.number(),
  code: Joi.string().max(20),
  name: Joi.string().max(100),
  type: Joi.string().valid("inbound", "outbound", "storage", "quarantine", "staging"),
  is_active: Joi.boolean()
});

module.exports = {
  createWarehouseSchema,
  updateWarehouseSchema,
  createZoneSchema,
  updateZoneSchema
};

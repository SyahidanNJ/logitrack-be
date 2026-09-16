const productService = require("../services/productService");
const respond = require("../tools/response");

const index = async (req, res) => {
  try {
    const data = await productService.getAll(req.query);
    return respond(res, req, "success", data, 200, false);
  } catch (err) {
    console.error(err);
    return respond(res, req, "serverError", null, 500, true);
  }
};

const show = async (req, res) => {
  if(!productService.getById) return respond(res, req, "notFound", null, 404, true);
  try {
    const data = await productService.getById(req.params.id);
    if (!data) return respond(res, req, "notFound", null, 404, true);
    return respond(res, req, "success", data, 200, false);
  } catch (err) {
    console.error(err);
    return respond(res, req, "serverError", null, 500, true);
  }
};

const store = async (req, res) => {
  if(!productService.create) return respond(res, req, "badRequest", null, 400, true);
  try {
    // Ponytail: inject performed_by if user exists
    if(req.user) req.body.performed_by = req.user.id;
    const data = await productService.create(req.body);
    return respond(res, req, "success", data, 201, false);
  } catch (err) {
    console.error(err);
    return respond(res, req, "serverError", null, 500, true);
  }
};

const update = async (req, res) => {
  if(!productService.update) return respond(res, req, "badRequest", null, 400, true);
  try {
    const data = await productService.update(req.params.id, req.body);
    if (!data) return respond(res, req, "notFound", null, 404, true);
    return respond(res, req, "success", data, 200, false);
  } catch (err) {
    console.error(err);
    return respond(res, req, "serverError", null, 500, true);
  }
};

const destroy = async (req, res) => {
  if(!productService.remove) return respond(res, req, "badRequest", null, 400, true);
  try {
    const data = await productService.remove(req.params.id);
    if (!data) return respond(res, req, "notFound", null, 404, true);
    return respond(res, req, "success", { deleted: true }, 200, false);
  } catch (err) {
    console.error(err);
    return respond(res, req, "serverError", null, 500, true);
  }
};

module.exports = { index, show, store, update, destroy };

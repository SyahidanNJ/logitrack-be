const userService = require("../services/userService");
const respond = require("../tools/response");

const index = async (req, res) => {
  try {
    const data = await userService.getAll(req.query);
    return respond(res, req, "success", data, 200, false);
  } catch (err) {
    console.error(err);
    return respond(res, req, "serverError", null, 500, true);
  }
};

const getEmployees = async (req, res) => {
  try {
    const data = await userService.getEmployees();
    return respond(res, req, "success", data, 200, false);
  } catch (err) {
    console.error(err);
    return respond(res, req, "serverError", null, 500, true);
  }
};


const show = async (req, res) => {
  if(!userService.getById) return respond(res, req, "notFound", null, 404, true);
  try {
    const data = await userService.getById(req.params.id);
    if (!data) return respond(res, req, "notFound", null, 404, true);
    return respond(res, req, "success", data, 200, false);
  } catch (err) {
    console.error(err);
    return respond(res, req, "serverError", null, 500, true);
  }
};

const store = async (req, res) => {
  if(!userService.create) return respond(res, req, "badRequest", null, 400, true);
  try {
    // Ponytail: inject performed_by if user exists
    if(req.user) req.body.performed_by = req.user.id;
    const data = await userService.create(req.body);
    return respond(res, req, "success", data, 201, false);
  } catch (err) {
    console.error(err);
    return respond(res, req, "serverError", null, 500, true);
  }
};

const update = async (req, res) => {
  if(!userService.update) return respond(res, req, "badRequest", null, 400, true);
  try {
    const data = await userService.update(req.params.id, req.body);
    if (!data) return respond(res, req, "notFound", null, 404, true);
    return respond(res, req, "success", data, 200, false);
  } catch (err) {
    console.error(err);
    return respond(res, req, "serverError", null, 500, true);
  }
};

const destroy = async (req, res) => {
  if(!userService.remove) return respond(res, req, "badRequest", null, 400, true);
  try {
    const data = await userService.remove(req.params.id);
    if (!data) return respond(res, req, "notFound", null, 404, true);
    return respond(res, req, "success", { deleted: true }, 200, false);
  } catch (err) {
    console.error(err);
    return respond(res, req, "serverError", null, 500, true);
  }
};

module.exports = { index, show, store, update, destroy, getEmployees };

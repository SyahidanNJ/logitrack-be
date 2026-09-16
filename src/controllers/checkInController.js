const checkInService = require("../services/checkInService");
const respond = require("../tools/response");

const index = async (req, res) => {
  try {
    const data = await checkInService.getAll(req.query);
    return respond(res, req, "success", data, 200, false);
  } catch (err) {
    console.error(err);
    return respond(res, req, "serverError", null, 500, true);
  }
};

const show = async (req, res) => {
  if(!checkInService.getById) return respond(res, req, "notFound", null, 404, true);
  try {
    const data = await checkInService.getById(req.params.id);
    if (!data) return respond(res, req, "notFound", null, 404, true);
    return respond(res, req, "success", data, 200, false);
  } catch (err) {
    console.error(err);
    return respond(res, req, "serverError", null, 500, true);
  }
};

const store = async (req, res) => {
  if(!checkInService.create) return respond(res, req, "badRequest", null, 400, true);
  try {
    // Ponytail: inject performed_by if user exists
    if(req.user) req.body.performed_by = req.user.id;
    if(req.file) req.body.document_file = "uploads/documents/" + req.file.filename;
    const data = await checkInService.create(req.body);
    return respond(res, req, "success", data, 201, false);
  } catch (err) {
    console.error(err);
    return respond(res, req, "serverError", null, 500, true);
  }
};

const update = async (req, res) => {
  if(!checkInService.update) return respond(res, req, "badRequest", null, 400, true);
  try {
    if(req.file) req.body.document_file = "uploads/documents/" + req.file.filename;
    const data = await checkInService.update(req.params.id, req.body);
    if (!data) return respond(res, req, "notFound", null, 404, true);
    return respond(res, req, "success", data, 200, false);
  } catch (err) {
    console.error(err);
    return respond(res, req, "serverError", null, 500, true);
  }
};

const destroy = async (req, res) => {
  if(!checkInService.remove) return respond(res, req, "badRequest", null, 400, true);
  try {
    const data = await checkInService.remove(req.params.id);
    if (!data) return respond(res, req, "notFound", null, 404, true);
    return respond(res, req, "success", { deleted: true }, 200, false);
  } catch (err) {
    console.error(err);
    return respond(res, req, "serverError", null, 500, true);
  }
};

module.exports = { index, show, store, update, destroy };

const zoneService = require("../services/zoneService");
const respond = require("../tools/response");

const index = async (req, res) => {
  try {
    const filters = req.query;
    const data = await zoneService.getAll(filters);
    return respond(res, req, "success", data, 200, false);
  } catch (err) {
    console.error(err);
    return respond(res, req, "serverError", null, 500, true);
  }
};

const show = async (req, res) => {
  try {
    const data = await zoneService.getById(req.params.id);
    if (!data) return respond(res, req, "notFound", null, 404, true);
    return respond(res, req, "success", data, 200, false);
  } catch (err) {
    console.error(err);
    return respond(res, req, "serverError", null, 500, true);
  }
};

const store = async (req, res) => {
  try {
    const data = await zoneService.create(req.body);
    return respond(res, req, "zoneCreated", data, 201, false);
  } catch (err) {
    console.error(err);
    if (err.name === "SequelizeUniqueConstraintError") {
      return respond(res, req, "badRequest", { error: "Zone code already exists in this warehouse" }, 400, true);
    }
    return respond(res, req, "serverError", null, 500, true);
  }
};

const update = async (req, res) => {
  try {
    const data = await zoneService.update(req.params.id, req.body);
    if (!data) return respond(res, req, "notFound", null, 404, true);
    return respond(res, req, "success", data, 200, false);
  } catch (err) {
    console.error(err);
    return respond(res, req, "serverError", null, 500, true);
  }
};

const destroy = async (req, res) => {
  try {
    const data = await zoneService.remove(req.params.id);
    if (!data) return respond(res, req, "notFound", null, 404, true);
    return respond(res, req, "success", { deleted: true }, 200, false);
  } catch (err) {
    console.error(err);
    return respond(res, req, "serverError", null, 500, true);
  }
};

module.exports = {
  index,
  show,
  store,
  update,
  destroy
};

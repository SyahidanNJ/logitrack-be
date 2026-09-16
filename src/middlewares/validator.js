const _ = require("lodash");
const respond = require("../tools/response");

/**
 * deepConvertToSnakeCase — recursively converts all object keys to snake_case.
 */
function deepConvertToSnakeCase(obj) {
  if (Array.isArray(obj)) return obj.map(deepConvertToSnakeCase);
  if (obj instanceof Date) return obj;
  if (obj !== null && typeof obj === "object") {
    return Object.keys(obj).reduce((acc, key) => {
      acc[_.snakeCase(key)] = deepConvertToSnakeCase(obj[key]);
      return acc;
    }, {});
  }
  return obj;
}

/**
 * validate(schema)
 * Joi schema validation middleware. On success, converts req.body to snake_case.
 */
const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const details = error.details.map((d) => d.message);
    return respond(res, req, "badRequest", { errors: details }, 400, true);
  }

  req.body = deepConvertToSnakeCase(value);
  next();
};

module.exports = { validate, deepConvertToSnakeCase };

"use strict";

const messages = require("../../config/messages.json");

/**
 * respond(res, req, key, data, statusCode, isError)
 *
 * @param {object}  res        - Express response object
 * @param {object}  req        - Express request object (may be null in some edge cases)
 * @param {string}  key        - Key into messages.json
 * @param {*}       data       - Payload to send
 * @param {number}  statusCode - HTTP status code (default 200)
 * @param {boolean} isError    - Whether this is an error response
 */
module.exports = (res, req, key, data, statusCode = 200, isError = false) => {
  const elapsed = req?.startTime ? new Date().getTime() - req.startTime : 0;

  // ── Console log ───────────────────────────────────────────────────────
  const reqStr = req
    ? JSON.stringify(req.body || req.params || req.query || {}).substring(0, 1000)
    : "";
  const resStr = data ? JSON.stringify(data).substring(0, 500) : "";

  console.log("\n==========================================================");
  console.log(`STATUS   : ${isError ? "ERR" : "OK"}`);
  console.log(`ENDPOINT : ${req?.originalUrl ?? ""}`);
  console.log(`IP       : ${(req?.ip || "").replace("::ffff:", "")}`);
  console.log(`TIME     : ${req?.customDate ?? ""} (${elapsed}ms)`);
  console.log("REQUEST  :", reqStr);
  console.log("RESPONSE :", resStr);
  console.log("==========================================================\n");

  // ── Resolve message ───────────────────────────────────────────────────
  const msg = messages[key] || (isError ? messages.serverError : messages.success);

  // ── Send HTTP response ────────────────────────────────────────────────
  return res.status(statusCode).json({
    status: !isError,
    error: isError,
    code: key || null,
    message: msg,
    data: data ?? null,
  });
};

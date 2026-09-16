const NodeCache = require("node-cache");

// Set cache to 1 hour standard TTL, check every 10 minutes
const roleCache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });

module.exports = roleCache;

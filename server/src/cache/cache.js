const NodeCache = require('node-cache');

// Standard TTL is 5 minutes (300 seconds) by default
const ttl = process.env.CACHE_TTL || 300;
const cache = new NodeCache({ stdTTL: ttl, checkperiod: ttl * 0.2, useClones: false });

module.exports = cache;

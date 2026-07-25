const express = require('express');
const { validateAuditRequest } = require('../middleware/validate');
const { performAudit } = require('../services/auditor');
const cache = require('../cache/cache');
const logger = require('../utils/logger');

const router = express.Router();

router.post('/', validateAuditRequest, async (req, res, next) => {
  try {
    const { url } = req.body;
    
    const cachedResult = cache.get(url);
    if (cachedResult) {
      req.log.info(`Cache hit for ${url}`);
      return res.status(200).json({
        success: true,
        cached: true,
        data: cachedResult
      });
    }

    const auditResult = await performAudit(url, req.log);
    
    // Save to cache
    cache.set(url, auditResult);

    res.status(200).json({
      success: true,
      cached: false,
      data: auditResult
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

const axios = require('axios');
const { File } = require('node:buffer');
if (typeof globalThis.File === 'undefined') globalThis.File = File;
const cheerio = require('cheerio');
const logger = require('../utils/logger');

// Simple concurrency limiter
const MAX_CONCURRENT = parseInt(process.env.MAX_CONCURRENT_REQUESTS || '10', 10);
let currentConcurrent = 0;

const performAudit = async (url, reqLog = logger) => {
  if (currentConcurrent >= MAX_CONCURRENT) {
    const error = new Error('Too many concurrent audit requests. Please try again later.');
    error.status = 503;
    throw error;
  }

  currentConcurrent++;
  try {
    reqLog.info(`Starting audit for ${url}`);
    const timeoutMs = parseInt(process.env.TIMEOUT_MS || '5000', 10);
    
    const startTime = Date.now();
    const response = await axios.get(url, {
      timeout: timeoutMs,
      headers: {
        'User-Agent': 'PagePulseAuditor/1.0'
      },
      // Do not throw error on non-2xx so we can audit them
      validateStatus: () => true 
    });

    const endTime = Date.now();
    const html = response.data;
    
    let title = null;
    let description = null;

    if (typeof html === 'string') {
        const $ = cheerio.load(html);
        title = $('title').text() || null;
        description = $('meta[name="description"]').attr('content') || null;
    }

    return {
      url,
      statusCode: response.status,
      responseTimeMs: endTime - startTime,
      seo: {
        title,
        description,
        hasTitle: !!title,
        hasDescription: !!description
      },
      auditedAt: new Date().toISOString()
    };
  } catch (error) {
    reqLog.error({ err: error, url }, 'Audit failed');
    if (error.code === 'ECONNABORTED') {
      const timeoutError = new Error(`Request timeout after ${process.env.TIMEOUT_MS}ms`);
      timeoutError.status = 504;
      throw timeoutError;
    }
    const fetchError = new Error(`Failed to audit URL: ${error.message}`);
    fetchError.status = 500;
    throw fetchError;
  } finally {
    currentConcurrent--;
  }
};

module.exports = { performAudit };

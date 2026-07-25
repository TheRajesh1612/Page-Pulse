const validateAuditRequest = (req, res, next) => {
  const { url } = req.body;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({
      success: false,
      error: { message: 'URL is required and must be a string.' }
    });
  }

  try {
    const parsedUrl = new URL(url);
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      throw new Error('Invalid protocol');
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: { message: 'Invalid URL provided. Must be a valid HTTP or HTTPS URL.' }
    });
  }

  next();
};

module.exports = { validateAuditRequest };

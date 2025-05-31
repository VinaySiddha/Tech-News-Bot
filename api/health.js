// filepath: api/health.js

module.exports = (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: {
      hasNewsApiKey: !!process.env.NEWS_API_KEY,
      port: process.env.PORT || 3000
    }
  });
};

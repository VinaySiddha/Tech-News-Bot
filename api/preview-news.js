// filepath: api/preview-news.js

const MarkdownIt = require('markdown-it');
const NewsService = require('../src/services/newsService');

const md = new MarkdownIt();
const newsService = new NewsService();

module.exports = async (req, res) => {
  try {
    const newsResult = await newsService.getFormattedDailyNews();
    if (!newsResult.success) {
      return res.status(500).json(newsResult);
    }
    const htmlContent = md.render(newsResult.message);
    res.status(200).json({
      success: true,
      raw: newsResult.message,
      html: htmlContent,
      articles: newsResult.articles,
      data: newsResult.rawData
    });
  } catch (error) {
    console.error('❌ Error in /preview-news:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

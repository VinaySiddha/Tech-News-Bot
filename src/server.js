require('dotenv').config();

const express = require('express');
const path = require('path');
const MarkdownIt = require('markdown-it');

// Services
const NewsService = require('./services/newsService');

class TechNewsBot {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3000;
        this.md = new MarkdownIt();
        
        // Initialize services
        this.newsService = new NewsService();
        
        this.setupMiddleware();
        this.setupRoutes();
    }

    setupMiddleware() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(express.static(path.join(__dirname, '../public')));
        
        // CORS for development
        this.app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
            next();
        });

        // Request logging
        this.app.use((req, res, next) => {
            console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
            next();
        });
    }

    setupRoutes() {
        // Health check
        this.app.get('/health', (req, res) => {
            try {
                res.json({
                    status: 'ok',
                    timestamp: new Date().toISOString(),
                    environment: {
                        hasNewsApiKey: !!process.env.NEWS_API_KEY,
                        port: this.port
                    }
                });
            } catch (error) {
                console.error('❌ Error in /health:', error);
                res.status(500).json({
                    status: 'error',
                    error: error.message
                });
            }
        });

        // Preview news endpoint (main way to get news)
        this.app.get('/preview-news', async (req, res) => {
            try {
                const newsResult = await this.newsService.getFormattedDailyNews();
                
                if (!newsResult.success) {
                    return res.status(500).json(newsResult);
                }

                const htmlContent = this.md.render(newsResult.message);
                
                res.json({
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
        });

        // Serve frontend
        this.app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, '../public/index.html'));
        });

        // 404 handler
        this.app.use('*', (req, res) => {
            res.status(404).json({
                success: false,
                error: 'Route not found',
                availableRoutes: [
                    'GET /',
                    'GET /health',
                    'GET /preview-news'
                ]
            });
        });

        // Error handler
        this.app.use((error, req, res, next) => {
            console.error('❌ Unhandled error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
                message: error.message
            });
        });
    }

    start() {
        this.app.listen(this.port, () => {
            console.log(`🌐 Tech News Bot server running on port ${this.port}`);
            console.log(`📰 News API: ${process.env.NEWS_API_KEY ? 'Configured' : 'Using free API'}`);
            console.log('');
            console.log('📋 Available endpoints:');
            console.log(`   GET  http://localhost:${this.port}/health`);
            console.log(`   GET  http://localhost:${this.port}/preview-news`);
            console.log('');
        });
    }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down Tech News Bot...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Shutting down Tech News Bot...');
    process.exit(0);
});

// Start the application
const bot = new TechNewsBot();
bot.start();
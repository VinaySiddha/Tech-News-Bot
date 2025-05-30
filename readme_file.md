# 📱 WhatsApp Tech News Bot

An automated Node.js application that fetches daily tech news from public APIs, summarizes articles, formats them in Markdown, and sends them to WhatsApp groups or contacts using the Baileys library.

![Tech News Bot](https://img.shields.io/badge/Node.js-Tech%20News%20Bot-brightgreen)
![WhatsApp](https://img.shields.io/badge/WhatsApp-Baileys-25D366)
![License](https://img.shields.io/badge/License-MIT-blue)

## ✨ Features

- 📰 **Automated News Fetching**: Retrieves latest tech news from multiple APIs
- 📱 **WhatsApp Integration**: Sends formatted news via Baileys library
- ⏰ **Scheduled Delivery**: Configurable cron-based automatic news delivery
- 🌐 **Web Interface**: Easy-to-use frontend for manual control
- 📝 **Markdown Formatting**: Professional news formatting with emojis
- 🔄 **Retry Logic**: Robust error handling and retry mechanisms
- 👥 **Group Support**: Send to individual contacts or WhatsApp groups
- 🎯 **Multiple APIs**: Support for NewsAPI and free alternatives

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ installed
- WhatsApp account for QR code scanning
- Optional: NewsAPI key for enhanced features

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd whatsapp-tech-news-bot
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Start the application**
```bash
npm start
```

5. **Scan QR code**
   - Watch the console for QR code
   - Scan with your WhatsApp mobile app
   - Wait for "Connection established" message

6. **Access web interface**
   - Open http://localhost:3000
   - Use the web interface to send news manually

## ⚙️ Configuration

### Environment Variables

```bash
# Server Configuration
PORT=3000

# News API Configuration (Optional - get free key from newsapi.org)
NEWS_API_KEY=your_newsapi_key_here
NEWS_API_URL=https://newsapi.org/v2/top-headlines

# WhatsApp Configuration
WHATSAPP_TARGET=919876543210@c.us  # Individual contact
# WHATSAPP_TARGET=120363042123456789@g.us  # Group ID

# Scheduling
CRON_SCHEDULE=0 8 * * *  # 8:00 AM daily
MAX_ARTICLES=5
```

### Getting WhatsApp IDs

**For Individual Contacts:**
- Format: `[country_code][phone_number]@c.us`
- Example: `919876543210@c.us` for +91 9876543210

**For Groups:**
- Start the bot and check console logs when messages are received
- Use the `/groups` endpoint to list all groups
- Format: `[group_id]@g.us`

## 📚 API Endpoints

### Health Check
```
GET /health
```
Returns bot status, connection info, and configuration details.

### Send News
```
GET /send-news
GET /send-news?target=919876543210@c.us
```
Manually send news to configured target or specified WhatsApp ID.

### Preview News
```
GET /preview-news
```
Preview formatted news without sending to WhatsApp.

### Get Groups
```
GET /groups
```
List all WhatsApp groups the bot has access to.

### Scheduler Controls
```
POST /schedule/start    # Start automatic scheduling
POST /schedule/stop     # Stop automatic scheduling
GET  /schedule/status   # Get scheduler status
POST /schedule/trigger  # Manually trigger scheduled news
```

## 🌐 Web Interface

The bot includes a modern web interface accessible at `http://localhost:3000`:

- **Real-time Status**: Connection status, API status, scheduler status
- **Manual Controls**: Send news, preview content, manage scheduling  
- **Group Management**: View and select WhatsApp groups
- **Responsive Design**: Works on desktop and mobile devices

## 📖 News Format Example

```
📰 *Daily Tech Digest* 📱
📅 Monday, December 25, 2023

*1. AI Transforms Education Sector*
OpenAI releases GPT-5 with revolutionary personalized tutoring capabilities. The new model shows unprecedented accuracy in adaptive learning.
🔗 https://example.com/news1
📰 _TechCrunch_

*2. Elon Musk's Neuralink Breakthrough*
Neuralink successfully tests brain-computer interface on human volunteers. Initial trials show promising results for paralysis treatment.
🔗 https://example.com/news2  
📰 _Reuters_

*3. Apple WWDC 2024 Highlights*
Apple announces macOS 15 with advanced AI integrations and improved privacy features. New hardware reveals include M4 chip architecture.
🔗 https://example.com/news3
📰 _Apple Newsroom_

_🤖 Powered by Tech News Bot_
_📅 Generated on 12/25/2023, 8:00:00 AM_
```

## 🔧 Advanced Configuration

### Custom News Sources

The bot supports multiple news APIs:

1. **NewsAPI** (Recommended - requires free API key)
   - More reliable and comprehensive
   - Better categorization and filtering
   - Rate limits: 1000 requests/day (free tier)

2. **Inshorts API** (Fallback - no key required)
   - Free alternative source
   - Limited customization options
   - Good for testing and backup

### Scheduling Options

Use cron expressions for flexible scheduling:

```bash
CRON_SCHEDULE=0 8 * * *      # Daily at 8:00 AM
CRON_SCHEDULE=0 8,20 * * *   # Twice daily at 8 AM and 8 PM  
CRON_SCHEDULE=0 8 * * 1-5    # Weekdays only at 8 AM
CRON_SCHEDULE=*/30 * * * *   # Every 30 minutes (testing)
```

### Error Handling

The bot includes comprehensive error handling:
- **Connection Retries**: Automatic WhatsApp reconnection
- **API Fallbacks**: Switch between news sources on failure  
- **Delivery Retries**: Multiple attempts for message sending
- **Error Notifications**: Send error alerts to configured WhatsApp

## 🛠️ Development

### Development Mode
```bash
npm run dev  # Uses nodemon for auto-restart
```

### Project Structure
```
├── src/
│   ├── services/
│   │   ├── whatsappService.js   # WhatsApp integration
│   │   ├── newsService.js       # News fetching & formatting
│   │   └── schedulerService.js  # Cron scheduling
│   └── server.js                # Main Express server
├── public/
│   └── index.html              # Web interface
├── .env.example                # Environment template
└── package.json               # Dependencies
```

### Adding New News Sources

To add a new news API:

1. Extend `NewsService` class in `src/services/newsService.js`
2. Add new fetch method following existing patterns
3. Update fallback logic in `fetchTechNews()`
4. Add configuration options to `.env`

## 🚨 Troubleshooting

### Common Issues

**WhatsApp Not Connecting**
- Ensure phone and computer are on same network during QR scan
- Delete `src/auth` folder and restart if connection issues persist
- Check if WhatsApp Web is accessible in your region

**News Not Fetching**
- Verify internet connection and API endpoints
- Check API key validity (for NewsAPI)
- Monitor console logs for specific error messages

**Messages Not Sending**
- Confirm WhatsApp target ID format
- Ensure bot account isn't rate-limited
- Check if target contact/group exists

**Scheduler Not Working**
- Verify `WHATSAPP_TARGET` is configured
- Check cron expression syntax
- Ensure bot stays running (use PM2 for production)

### Debug Mode

Enable detailed logging by setting environment variable:
```bash
DEBUG=true npm start
```

## 🚀 Production Deployment

### Using PM2 (Recommended)

```bash
# Install PM2 globally
npm install -g pm2

# Start application with PM2
pm2 start src/server.js --name "tech-news-bot"

# Monitor logs
pm2 logs tech-news-bot

# Auto-start on system reboot
pm2 startup
pm2 save
```

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

### Security Considerations

- Keep your `.env` file secure and never commit it to version control
- Use environment-specific configurations for production
- Consider using secrets management for API keys
- Regularly update dependencies for security patches
- Monitor bot activity and set up alerts for failures

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

- 🐛 **Issues**: [GitHub Issues](https://github.com/yourusername/whatsapp-tech-news-bot/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/yourusername/whatsapp-tech-news-bot/discussions)
- 📧 **Email**: your.email@example.com

## 🙏 Acknowledgments

- [Baileys](https://github.com/WhiskeySockets/Baileys) - WhatsApp Web API
- [NewsAPI](https://newsapi.org/) - News data provider
- [Inshorts API](https://github.com/cyberboysumanjay/Inshorts-News-API) - Alternative news source

---

Made with ❤️ for the tech community. Happy coding! 🚀
# 🚀 Portfolio Backend

A robust Node.js/Express backend for Varun Sahukar's portfolio website with email functionality, analytics tracking, and project management.

## ✨ Features

- **📧 Contact Form Processing** - Send emails via Gmail, Outlook, or custom SMTP
- **📊 Analytics Tracking** - Monitor visits, page views, and user behavior
- **🏗️ Project Management** - API endpoints for project data
- **🔒 Security** - Rate limiting, CORS, Helmet security headers
- **📱 Responsive** - Serves your portfolio HTML with SPA support
- **📈 Performance** - Compression, logging, and monitoring

## 🛠️ Tech Stack

- **Runtime**: Node.js (v16+)
- **Framework**: Express.js
- **Email**: Nodemailer
- **Security**: Helmet, CORS, Rate Limiting
- **Validation**: Express-validator
- **Logging**: Morgan, Winston
- **Performance**: Compression

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Gmail account (for email functionality)
- Git

## 🚀 Quick Start

### 1. Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd portfolio-backend

# Install dependencies
npm install
```

### 2. Environment Setup

```bash
# Copy environment template
cp env.example .env

# Edit .env with your configuration
nano .env
```

### 3. Email Configuration

#### For Gmail:
1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account Settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Update your `.env` file:
   ```env
   EMAIL_SERVICE=Gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_APP_PASSWORD=your-16-char-app-password
   ```

#### For Custom SMTP:
```env
EMAIL_SERVICE=custom
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_SECURE=false
EMAIL_USER=your-email@domain.com
EMAIL_PASSWORD=your-password
```

### 4. Start the Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## 📁 Project Structure

```
portfolio-backend/
├── routes/
│   ├── contact.js      # Contact form processing
│   ├── analytics.js    # Visit tracking & analytics
│   └── projects.js     # Project data management
├── protfolio-html/     # Your portfolio frontend
├── server.js           # Main server file
├── package.json        # Dependencies & scripts
├── env.example         # Environment template
└── README.md           # This file
```

## 🔌 API Endpoints

### Contact Form
- `POST /api/contact/submit` - Submit contact form
- `POST /api/contact/test` - Test email (development only)

### Analytics
- `POST /api/analytics/track` - Track page visit
- `POST /api/analytics/contact-submission` - Track contact submission
- `GET /api/analytics/dashboard` - Get analytics dashboard
- `GET /api/analytics/stats` - Get basic statistics

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get project by ID
- `GET /api/projects/categories/list` - Get project categories
- `GET /api/projects/category/:category` - Get projects by category
- `GET /api/projects/search/:query` - Search projects
- `GET /api/projects/stats/overview` - Get project statistics

### Health Check
- `GET /api/health` - Server health status

## 📧 Email Templates

The backend sends two emails for each contact form submission:

1. **Notification Email** (to you) - Contains visitor's message and details
2. **Confirmation Email** (to visitor) - Thank you message with message summary

Both emails use professional HTML templates with your branding.

## 🔒 Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS Protection**: Configurable origin restrictions
- **Helmet Security**: Security headers and CSP policies
- **Input Validation**: Comprehensive form validation
- **Error Handling**: Secure error messages without data leakage

## 📊 Analytics Features

- **Page Views**: Track visits to different sections
- **Device Detection**: Desktop, mobile, tablet identification
- **Browser Tracking**: Chrome, Firefox, Safari, Edge, Opera
- **Geographic Data**: Country-based visitor tracking
- **Referrer Tracking**: Where visitors come from
- **Contact Metrics**: Form submission tracking

## 🚀 Deployment

### Heroku
```bash
# Install Heroku CLI
heroku create your-portfolio-backend
heroku config:set NODE_ENV=production
heroku config:set EMAIL_USER=your-email@gmail.com
heroku config:set EMAIL_APP_PASSWORD=your-app-password
git push heroku main
```

### Vercel
```bash
# Install Vercel CLI
npm i -g vercel
vercel --prod
```

### DigitalOcean App Platform
1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically

### Docker
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `5000` |
| `FRONTEND_URL` | Frontend origin for CORS | `http://localhost:3000` |
| `EMAIL_SERVICE` | Email provider | `Gmail` |
| `EMAIL_USER` | Your email address | Required |
| `EMAIL_APP_PASSWORD` | Gmail app password | Required for Gmail |
| `SMTP_HOST` | SMTP server host | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP server port | `587` |

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 📝 Development

### Adding New Routes
1. Create route file in `routes/` directory
2. Import in `server.js`
3. Add middleware and validation as needed

### Database Integration
The current version uses in-memory storage. To add a database:

1. Install database driver (e.g., `mongoose` for MongoDB)
2. Create models in `models/` directory
3. Update routes to use database operations
4. Add connection logic in `server.js`

### Custom Email Templates
Modify the HTML templates in `routes/contact.js` to match your branding.

## 🐛 Troubleshooting

### Email Not Sending
- Check Gmail app password is correct
- Verify 2FA is enabled on Gmail
- Check firewall/antivirus blocking SMTP
- Verify environment variables are set correctly

### CORS Issues
- Update `FRONTEND_URL` in `.env`
- Check browser console for CORS errors
- Verify frontend is making requests to correct backend URL

### Port Already in Use
```bash
# Find process using port 5000
lsof -i :5000

# Kill process
kill -9 <PID>

# Or use different port
PORT=5001 npm run dev
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, email varunsahukar9798@gmail.com or create an issue in the repository.

---

**Built with ❤️ by Varun Sahukar**

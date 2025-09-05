# Personal Portfolio

A professional portfolio website showcasing development skills and projects with a robust Node.js backend.

## Technology Stack

**Frontend**
- HTML5, CSS3, JavaScript
- Responsive Design
- Custom CSS Animations
- Dynamic Content Loading

**Backend**
- Node.js & Express.js
- RESTful API
- Email Integration (Nodemailer)
- Analytics System

## Live Demo
- Website: [varunsahukar.com](https://varunsahukar.com)
- API: [api.varunsahukar.com](https://api.varunsahukar.com)

## Core Features

- **Project Showcase**
  - Filterable Gallery
  - Project Details
  - Live Demo Links

- **Contact System**
  - Form Validation
  - Email Notifications
  - Auto-Response

- **Analytics**
  - Visit Tracking
  - User Behavior Analysis
  - Performance Monitoring

## Quick Setup

```bash
# Clone repository
git clone https://github.com/varunsahukar/portfolio
cd portfolio

# Install dependencies
npm install

# Start server
npm run dev     # Development (http://localhost:5000)
npm start       # Production
```

## API Endpoints

```javascript
// Contact
POST /api/contact/submit     // Contact form submission

// Projects
GET  /api/projects          // Get all projects
GET  /api/projects/:id      // Get single project

// Analytics
GET  /api/analytics/stats   // View statistics
```

## Environment Setup
```env
PORT=5000
EMAIL_USER=your@email.com
EMAIL_APP_PASSWORD=your-password
```

## Deployment

```bash
# Heroku
heroku create
git push heroku main

# Manual Deployment
npm run build
npm start
```

## Project Structure
```
portfolio/
├── public/
│   ├── index.html
│   ├── css/
│   ├── js/
│   └── assets/
└── server/
    ├── routes/
    ├── config/
    └── server.js
```

## Contact & Support

- Email: varunsahukar9798@gmail.com
- GitHub: [@varunsahukar](https://github.com/varunsahukar)
- LinkedIn: [Varun Sahukar](https://linkedin.com/in/varunsahukar)

---
MIT Licensed | © 2023 Varun Sahukar

const express = require('express');
const router = express.Router();

// In-memory storage for analytics (in production, use a database)
let analyticsData = {
  totalVisits: 0,
  uniqueVisitors: new Set(),
  pageViews: {
    home: 0,
    skills: 0,
    projects: 0,
    contact: 0
  },
  contactSubmissions: 0,
  lastVisit: null,
  deviceTypes: {
    desktop: 0,
    mobile: 0,
    tablet: 0
  },
  browsers: {},
  countries: {},
  referrers: {}
};

// Helper function to detect device type
const detectDeviceType = (userAgent) => {
  if (/Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
    if (/iPad|Android(?=.*\bMobile\b)(?=.*\bSafari\b)/i.test(userAgent)) {
      return 'tablet';
    }
    return 'mobile';
  }
  return 'desktop';
};

// Helper function to detect browser
const detectBrowser = (userAgent) => {
  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Safari')) return 'Safari';
  if (userAgent.includes('Edge')) return 'Edge';
  if (userAgent.includes('Opera')) return 'Opera';
  return 'Other';
};

// Track page visit
router.post('/track', (req, res) => {
  try {
    const { page, referrer, country, ip } = req.body;
    const userAgent = req.get('User-Agent') || '';
    const deviceType = detectDeviceType(userAgent);
    const browser = detectBrowser(userAgent);

    // Update analytics data
    analyticsData.totalVisits++;
    analyticsData.lastVisit = new Date().toISOString();
    
    // Track unique visitors by IP (basic approach)
    if (ip) {
      analyticsData.uniqueVisitors.add(ip);
    }

    // Track page views
    if (page && analyticsData.pageViews[page] !== undefined) {
      analyticsData.pageViews[page]++;
    }

    // Track device types
    analyticsData.deviceTypes[deviceType]++;

    // Track browsers
    analyticsData.browsers[browser] = (analyticsData.browsers[browser] || 0) + 1;

    // Track countries
    if (country) {
      analyticsData.countries[country] = (analyticsData.countries[country] || 0) + 1;
    }

    // Track referrers
    if (referrer) {
      const domain = new URL(referrer).hostname;
      analyticsData.referrers[domain] = (analyticsData.referrers[domain] || 0) + 1;
    }

    res.json({
      success: true,
      message: 'Visit tracked successfully'
    });

  } catch (error) {
    console.error('Analytics tracking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to track visit'
    });
  }
});

// Track contact form submission
router.post('/contact-submission', (req, res) => {
  try {
    analyticsData.contactSubmissions++;
    res.json({
      success: true,
      message: 'Contact submission tracked'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to track contact submission'
    });
  }
});

// Get analytics dashboard data
router.get('/dashboard', (req, res) => {
  try {
    const dashboardData = {
      ...analyticsData,
      uniqueVisitors: analyticsData.uniqueVisitors.size,
      browsers: Object.entries(analyticsData.browsers)
        .map(([browser, count]) => ({ browser, count }))
        .sort((a, b) => b.count - a.count),
      countries: Object.entries(analyticsData.countries)
        .map(([country, count]) => ({ country, count }))
        .sort((a, b) => b.count - a.count),
      referrers: Object.entries(analyticsData.referrers)
        .map(([referrer, count]) => ({ referrer, count }))
        .sort((a, b) => b.count - a.count),
      pageViews: Object.entries(analyticsData.pageViews)
        .map(([page, count]) => ({ page, count }))
        .sort((a, b) => b.count - a.count)
    };

    res.json({
      success: true,
      data: dashboardData
    });

  } catch (error) {
    console.error('Analytics dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get analytics data'
    });
  }
});

// Get basic stats
router.get('/stats', (req, res) => {
  try {
    const stats = {
      totalVisits: analyticsData.totalVisits,
      uniqueVisitors: analyticsData.uniqueVisitors.size,
      totalPageViews: Object.values(analyticsData.pageViews).reduce((a, b) => a + b, 0),
      contactSubmissions: analyticsData.contactSubmissions,
      lastVisit: analyticsData.lastVisit
    };

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get stats'
    });
  }
});

// Reset analytics (for development/testing)
if (process.env.NODE_ENV === 'development') {
  router.post('/reset', (req, res) => {
    analyticsData = {
      totalVisits: 0,
      uniqueVisitors: new Set(),
      pageViews: {
        home: 0,
        skills: 0,
        projects: 0,
        contact: 0
      },
      contactSubmissions: 0,
      lastVisit: null,
      deviceTypes: {
        desktop: 0,
        mobile: 0,
        tablet: 0
      },
      browsers: {},
      countries: {},
      referrers: {}
    };

    res.json({
      success: true,
      message: 'Analytics data reset successfully'
    });
  });
}

module.exports = router;

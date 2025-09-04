const express = require('express');
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const router = express.Router();

// Email transporter configuration
const createTransporter = () => {
  if (process.env.EMAIL_SERVICE === 'Gmail') {
    return nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD // Use App Password for Gmail
      }
    });
  } else if (process.env.EMAIL_SERVICE === 'Outlook') {
    return nodemailer.createTransporter({
      service: 'outlook',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  } else {
    // Custom SMTP
    return nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }
};

// Validation rules
const contactValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('subject')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Subject must be between 5 and 100 characters'),
  
  body('message')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Message must be between 10 and 1000 characters')
];

// Contact form submission
router.post('/submit', contactValidation, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, subject, message } = req.body;

    // Create email transporter
    const transporter = createTransporter();

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send to yourself
      replyTo: email,
      subject: `Portfolio Contact: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #60a5fa; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #495057; margin-top: 0;">Contact Details</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
          </div>
          
          <div style="background: #ffffff; padding: 20px; border: 1px solid #dee2e6; border-radius: 8px;">
            <h3 style="color: #495057; margin-top: 0;">Message</h3>
            <p style="line-height: 1.6; color: #333;">${message.replace(/\n/g, '<br>')}</p>
          </div>
          
          <div style="margin-top: 30px; padding: 15px; background: #e9ecef; border-radius: 5px; font-size: 12px; color: #6c757d;">
            <p style="margin: 0;">This message was sent from your portfolio website contact form.</p>
            <p style="margin: 5px 0 0 0;">Timestamp: ${new Date().toLocaleString()}</p>
          </div>
        </div>
      `,
      text: `
New Contact Form Submission

Contact Details:
- Name: ${name}
- Email: ${email}
- Subject: ${subject}

Message:
${message}

---
This message was sent from your portfolio website contact form.
Timestamp: ${new Date().toLocaleString()}
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Send confirmation email to the user
    const confirmationMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Thank you for contacting me!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #60a5fa; padding-bottom: 10px;">
            Thank you for reaching out!
          </h2>
          
          <p style="line-height: 1.6; color: #333;">
            Hi ${name},
          </p>
          
          <p style="line-height: 1.6; color: #333;">
            Thank you for contacting me through my portfolio website. I've received your message and will get back to you as soon as possible.
          </p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #495057; margin-top: 0;">Your Message Summary</h3>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong> ${message.substring(0, 100)}${message.length > 100 ? '...' : ''}</p>
          </div>
          
          <p style="line-height: 1.6; color: #333;">
            I typically respond within 24 hours. If you have any urgent inquiries, feel free to reach out through my other channels.
          </p>
          
          <div style="margin-top: 30px; padding: 15px; background: #e9ecef; border-radius: 5px; font-size: 12px; color: #6c757d;">
            <p style="margin: 0;">Best regards,</p>
            <p style="margin: 5px 0 0 0;"><strong>Varun Sahukar</strong></p>
            <p style="margin: 5px 0 0 0;">Frontend Engineer & Co-Founder @BePro</p>
          </div>
        </div>
      `
    };

    // Send confirmation email
    await transporter.sendMail(confirmationMailOptions);

    res.status(200).json({
      success: true,
      message: 'Message sent successfully! I\'ll get back to you soon.'
    });

  } catch (error) {
    console.error('Email sending error:', error);
    
    const emailError = new Error('Failed to send email');
    emailError.name = 'EmailError';
    throw emailError;
  }
});

// Test email endpoint (for development)
if (process.env.NODE_ENV === 'development') {
  router.post('/test', async (req, res) => {
    try {
      const transporter = createTransporter();
      
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: 'Portfolio Backend Test Email',
        text: 'This is a test email from your portfolio backend server.'
      });
      
      res.json({ success: true, message: 'Test email sent successfully!' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });
}

module.exports = router;

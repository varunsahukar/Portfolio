// Mobile menu toggle
document.getElementById('mobileMenu').addEventListener('click', function() {
    const overlay = document.getElementById('mobileNavOverlay');
    const mobileMenu = document.getElementById('mobileMenu');
    
    overlay.classList.add('active');
    mobileMenu.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
});

// Mobile menu close
document.getElementById('mobileNavClose').addEventListener('click', function() {
    const overlay = document.getElementById('mobileNavOverlay');
    const mobileMenu = document.getElementById('mobileMenu');
    
    overlay.classList.remove('active');
    mobileMenu.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.mobile-nav-links a').forEach(link => {
    link.addEventListener('click', function() {
        const overlay = document.getElementById('mobileNavOverlay');
        const mobileMenu = document.getElementById('mobileMenu');
        
        overlay.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Close mobile menu when clicking outside
document.getElementById('mobileNavOverlay').addEventListener('click', function(e) {
    if (e.target === this) {
        const overlay = document.getElementById('mobileNavOverlay');
        const mobileMenu = document.getElementById('mobileMenu');
        
        overlay.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navigation active state
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
});

// Scroll Progress Indicator
window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    const progressBar = document.getElementById('scrollProgress');
    if (progressBar) {
        progressBar.style.width = scrollPercent + '%';
    }
});

// Ensure skills marquee is wide enough for seamless loop
window.addEventListener('load', () => {
    const track = document.querySelector('.skills-track');
    if (!track) return;
    // Duplicate content if not already duplicated sufficiently
    const items = Array.from(track.children);
    const trackWidth = track.scrollWidth;
    const container = document.querySelector('.skills-marquee');
    if (!container) return;
    const containerWidth = container.clientWidth;
    if (trackWidth < containerWidth * 2) {
        items.forEach(node => track.appendChild(node.cloneNode(true)));
    }
});

// Dynamic Text Rotation for Hero Title
const dynamicWords = [
    'innovative',
    'scalable',
    'beautiful',
    'fast',
    'modern',
    'responsive',
    'interactive',
    'cutting-edge',
    'user-centric',
    'performance-driven'
];

let currentWordIndex = 0;
let isDeleting = false;
let currentText = '';
let typeSpeed = 100;

function typeDynamicText() {
    const dynamicTextElement = document.getElementById('dynamicText');
    if (!dynamicTextElement) return;

    const currentWord = dynamicWords[currentWordIndex];
    
    if (isDeleting) {
        currentText = currentWord.substring(0, currentText.length - 1);
        typeSpeed = 50;
    } else {
        currentText = currentWord.substring(0, currentText.length + 1);
        typeSpeed = 100;
    }

    dynamicTextElement.textContent = currentText;

    if (!isDeleting && currentText === currentWord) {
        typeSpeed = 2000; // Pause at end of word
        isDeleting = true;
    } else if (isDeleting && currentText === '') {
        isDeleting = false;
        currentWordIndex = (currentWordIndex + 1) % dynamicWords.length;
        typeSpeed = 500; // Pause before next word
    }

    setTimeout(typeDynamicText, typeSpeed);
}

// Contact form handling
document.getElementById('contactForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const submitBtn = this.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    
    // Get form data
    const formData = new FormData(this);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message')
    };
    
    // Show loading state
    submitBtn.innerHTML = 'Sending... <span>⏳</span>';
    submitBtn.disabled = true;
    
    try {
        // Send to backend
        const response = await fetch('/api/contact/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Show success state
            submitBtn.innerHTML = 'Message sent! <span>✅</span>';
            submitBtn.style.background = '#10b981';
            
            // Track contact submission
            fetch('/api/analytics/contact-submission', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            }).catch(console.error);
            
            // Reset form
            this.reset();
            
            // Reset button after 3 seconds
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                submitBtn.style.background = '#ffffff';
            }, 3000);
            
            // Show success message
            alert(result.message);
        } else {
            throw new Error(result.message || 'Failed to send message');
        }
        
    } catch (error) {
        console.error('Contact form error:', error);
        
        // Show error state
        submitBtn.innerHTML = 'Failed to send <span>❌</span>';
        submitBtn.style.background = '#ef4444';
        
        // Reset button after 3 seconds
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            submitBtn.style.background = '#ffffff';
        }, 3000);
        
        // Show error message
        alert('Failed to send message. Please try again or contact me directly.');
    }
});

// Custom Cursor (minimal, professional) with smooth lerp
const cursor = document.getElementById('cursor');
let targetX = 0, targetY = 0;
let currentX = 0, currentY = 0;
const cursorHalf = 7; // half of 14px
const smoothing = 0.18; // 0..1, higher is snappier

document.addEventListener('mousemove', (e) => {
    if (!cursor) return;
    targetX = e.clientX - cursorHalf;
    targetY = e.clientY - cursorHalf;
});

function animateCursor() {
    // Linear interpolation towards target for smoothness
    currentX += (targetX - currentX) * smoothing;
    currentY += (targetY - currentY) * smoothing;
    if (cursor) {
        cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
    }
    requestAnimationFrame(animateCursor);
}

if (cursor) requestAnimationFrame(animateCursor);

// Initialize all animations on page load
window.addEventListener('load', () => {
    // Ensure hero title is visible
    const titleLines = document.querySelectorAll('.title-line');
    titleLines.forEach(line => {
        line.style.opacity = '1';
        line.style.transform = 'translateY(0)';
        line.style.display = 'block';
        line.style.visibility = 'visible';
    });

    // Start dynamic text rotation
    setTimeout(() => {
        typeDynamicText();
    }, 1000);
    
    // Track page visit
    trackPageVisit('home');
});

// Analytics tracking function
async function trackPageVisit(page) {
    try {
        await fetch('/api/analytics/track', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                page: page,
                referrer: document.referrer || null,
                timestamp: new Date().toISOString()
            })
        });
    } catch (error) {
        console.error('Analytics tracking failed:', error);
    }
}

// Track navigation to different sections
document.addEventListener('DOMContentLoaded', () => {
    // Track when user navigates to different sections
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -50% 0px'
    };
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                if (sectionId) {
                    trackPageVisit(sectionId);
                }
            }
        });
    }, observerOptions);
    
    // Observe all sections
    document.querySelectorAll('section[id]').forEach(section => {
        sectionObserver.observe(section);
    });
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});
// DOM Elements
const faqItems = document.querySelectorAll('.faq-item');
const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanes = document.querySelectorAll('.tab-pane');
const registrationForm = document.getElementById('registrationForm');
const statNumbers = document.querySelectorAll('.stat-number');

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeFAQ();
    initializeTabs();
    initializeForm();
    initializeCounters();
    initializeCountdown();
    initializeSmoothScroll();
});

// FAQ Functionality
function initializeFAQ() {
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
}

// Tabs Functionality
function initializeTabs() {
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked button and corresponding pane
            button.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
}

// Form Functionality
function initializeForm() {
    if (registrationForm) {
        registrationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Validate form
            if (validateForm(data)) {
                // Show success message
                showSuccessMessage();
                
                // In a real application, you would send this data to a server
                console.log('Form data:', data);
                
                // Reset form
                this.reset();
            }
        });
    }
}

// Form Validation
function validateForm(data) {
    const requiredFields = ['name', 'phone', 'age', 'education', 'package'];
    
    for (let field of requiredFields) {
        if (!data[field] || data[field].trim() === '') {
            showErrorMessage(`يرجى ملء حقل ${getFieldLabel(field)}`);
            return false;
        }
    }
    
    // Validate phone number (Egyptian format)
    const phoneRegex = /^01[0-2,5]{1}[0-9]{8}$/;
    if (!phoneRegex.test(data.phone)) {
        showErrorMessage('يرجى إدخال رقم هاتف صحيح');
        return false;
    }
    
    // Validate age
    const age = parseInt(data.age);
    if (age < 16 || age > 50) {
        showErrorMessage('العمر يجب أن يكون بين 16 و 50 سنة');
        return false;
    }
    
    // Check terms acceptance
    if (!data.terms) {
        showErrorMessage('يجب الموافقة على الشروط والأحكام');
        return false;
    }
    
    return true;
}

// Get field label in Arabic
function getFieldLabel(field) {
    const labels = {
        'name': 'الاسم الكامل',
        'phone': 'رقم الهاتف',
        'age': 'العمر',
        'education': 'المؤهل الدراسي',
        'package': 'نوع العرض'
    };
    return labels[field] || field;
}

// Show success message
function showSuccessMessage() {
    const message = document.createElement('div');
    message.className = 'alert alert-success';
    message.innerHTML = `
        <i class="fas fa-check-circle"></i>
        تم تسجيل طلبك بنجاح! سنتواصل معك قريباً لتأكيد الحجز.
    `;
    
    const form = document.getElementById('registrationForm');
    form.parentNode.insertBefore(message, form);
    
    // Remove message after 5 seconds
    setTimeout(() => {
        message.remove();
    }, 5000);
    
    // Scroll to message
    message.scrollIntoView({ behavior: 'smooth' });
}

// Show error message
function showErrorMessage(text) {
    const message = document.createElement('div');
    message.className = 'alert alert-error';
    message.innerHTML = `
        <i class="fas fa-exclamation-triangle"></i>
        ${text}
    `;
    
    const form = document.getElementById('registrationForm');
    form.parentNode.insertBefore(message, form);
    
    // Remove message after 5 seconds
    setTimeout(() => {
        message.remove();
    }, 5000);
    
    // Scroll to message
    message.scrollIntoView({ behavior: 'smooth' });
}

// Counter Animation
function initializeCounters() {
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    statNumbers.forEach(counter => {
        observer.observe(counter);
    });
}

// Animate counter
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'));
    const duration = 2000; // 2 seconds
    const step = target / (duration / 16); // 60 FPS
    let current = 0;
    
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        // Format number based on target
        if (target === 4.8) {
            element.textContent = current.toFixed(1);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Countdown Timer
function initializeCountdown() {
    const countdownElement = document.getElementById('countdown');
    if (!countdownElement) return;
    
    // Set target date (June 17, 2025)
    const targetDate = new Date('2025-06-17T23:59:59').getTime();
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate - now;
        
        if (distance > 0) {
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            countdownElement.textContent = days;
        } else {
            countdownElement.textContent = '0';
        }
    }
    
    // Update immediately and then every hour
    updateCountdown();
    setInterval(updateCountdown, 3600000); // Update every hour
}

// Smooth Scroll
function initializeSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }
});

// Add CSS for alert messages
const alertStyles = `
    .alert {
        padding: 1rem 1.5rem;
        border-radius: 8px;
        margin-bottom: 1rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 600;
        animation: slideIn 0.3s ease;
    }
    
    .alert-success {
        background: #d1fae5;
        color: #065f46;
        border: 1px solid #a7f3d0;
    }
    
    .alert-error {
        background: #fee2e2;
        color: #991b1b;
        border: 1px solid #fca5a5;
    }
    
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

// Inject alert styles
const styleSheet = document.createElement('style');
styleSheet.textContent = alertStyles;
document.head.appendChild(styleSheet);

// WhatsApp integration
function openWhatsApp() {
    const phoneNumber = '201234567890'; // Replace with actual number
    const message = encodeURIComponent('مرحباً، أريد التسجيل في ورشة الجرافيك والتسويق');
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappURL, '_blank');
}

// Add click event to WhatsApp button
document.addEventListener('DOMContentLoaded', function() {
    const whatsappButton = document.querySelector('.whatsapp-float a');
    if (whatsappButton) {
        whatsappButton.addEventListener('click', function(e) {
            e.preventDefault();
            openWhatsApp();
        });
    }
});

// Lazy loading for images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Performance optimization
function optimizePerformance() {
    // Preload critical resources
    const criticalImages = [
        'assets/images/workshop.jpg',
        'assets/images/graphic-design.png',
        'assets/images/digital-marketing.png'
    ];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

// Initialize performance optimizations
document.addEventListener('DOMContentLoaded', optimizePerformance);

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // In production, you might want to send this to an error tracking service
});

// Service Worker registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}


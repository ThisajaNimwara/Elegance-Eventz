// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

// Main initialization function
function initializeWebsite() {
    // Show the page
    document.body.style.opacity = '1';
    
    // Initialize all components
    initializeNavigation();
    initializeScrollEffects();
    initializeAnimations();
    initializeFormHandling();
    initializeInteractiveElements();
    
    // Add initial animations
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.classList.add('animate-on-scroll');
    }
}

// Navigation Functions
function initializeNavigation() {
    const header = document.getElementById('header');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    // Header scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle - prefer overlay drawer (#nav-drawer) when present,
    // otherwise fall back to toggling the inline nav-menu (.nav-menu.active).
    const navDrawer = document.getElementById('nav-drawer');
    if (mobileMenuToggle) {
        // Accessibility
        mobileMenuToggle.setAttribute('role', 'button');
        mobileMenuToggle.tabIndex = 0;

        const openDrawer = () => {
            if (!navDrawer) return;
            const isOpen = navDrawer.classList.toggle('open');
            navDrawer.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
            mobileMenuToggle.classList.toggle('active', isOpen);
            mobileMenuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            // If opened, focus the close button for accessibility
            if (isOpen) {
                const closeBtn = navDrawer.querySelector('.drawer-close');
                if (closeBtn) {
                    closeBtn.focus();
                }
            }
        };

        const openInlineMenu = () => {
            if (!navMenu) return;
            const isOpen = navMenu.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active', isOpen);
            mobileMenuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        };

        const toggle = (e) => {
            if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
            if (navDrawer) openDrawer(); else openInlineMenu();
        };

        mobileMenuToggle.addEventListener('click', toggle);
        mobileMenuToggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
                e.preventDefault();
                toggle(e);
            }
            if (e.key === 'Escape') {
                if (navDrawer && navDrawer.classList.contains('open')) {
                    navDrawer.classList.remove('open');
                    navDrawer.setAttribute('aria-hidden', 'true');
                    mobileMenuToggle.classList.remove('active');
                    mobileMenuToggle.setAttribute('aria-expanded', 'false');
                }
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    mobileMenuToggle.classList.remove('active');
                    mobileMenuToggle.setAttribute('aria-expanded', 'false');
                }
            }
        });

        // Close on link click for drawer or inline menu
        if (navDrawer) {
            navDrawer.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    navDrawer.classList.remove('open');
                    navDrawer.setAttribute('aria-hidden', 'true');
                    mobileMenuToggle.classList.remove('active');
                    mobileMenuToggle.setAttribute('aria-expanded', 'false');
                });
            });

            // Close button inside drawer
            const closeBtn = navDrawer.querySelector('.drawer-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    navDrawer.classList.remove('open');
                    navDrawer.setAttribute('aria-hidden', 'true');
                    mobileMenuToggle.classList.remove('active');
                    mobileMenuToggle.setAttribute('aria-expanded', 'false');
                    mobileMenuToggle.focus();
                });
            }

            // Close when clicking outside drawer
            document.addEventListener('click', (e) => {
                const inside = navDrawer.contains(e.target) || mobileMenuToggle.contains(e.target);
                if (!inside && navDrawer.classList.contains('open')) {
                    navDrawer.classList.remove('open');
                    navDrawer.setAttribute('aria-hidden', 'true');
                    mobileMenuToggle.classList.remove('active');
                    mobileMenuToggle.setAttribute('aria-expanded', 'false');
                }
            });
        } else if (navMenu) {
            navMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    navMenu.classList.remove('active');
                    mobileMenuToggle.classList.remove('active');
                    mobileMenuToggle.setAttribute('aria-expanded', 'false');
                });
            });

            // Close when clicking outside inline menu
            document.addEventListener('click', (e) => {
                if (!mobileMenuToggle.contains(e.target) && !navMenu.contains(e.target)) {
                    navMenu.classList.remove('active');
                    mobileMenuToggle.classList.remove('active');
                    mobileMenuToggle.setAttribute('aria-expanded', 'false');
                }
            });
        }
    }
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll Effects and Animations
function initializeScrollEffects() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Add staggered animation for grid items
                if (entry.target.classList.contains('service-card') || 
                    entry.target.classList.contains('feature') || 
                    entry.target.classList.contains('step')) {
                    addStaggeredAnimation(entry.target);
                }
            }
        });
    }, observerOptions);
    
    // Observe all elements with fade-in class
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
    
    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElement = document.querySelector('.hero::before');
        
        if (parallaxElement && scrolled < window.innerHeight) {
            const speed = scrolled * 0.5;
            parallaxElement.style.transform = `translateY(${speed}px)`;
        }
    });
}

// Animation Functions
function initializeAnimations() {
    // Add staggered animations to grid items
    const serviceCards = document.querySelectorAll('.service-card');
    const features = document.querySelectorAll('.feature');
    const steps = document.querySelectorAll('.step');
    
    // Apply initial delay for staggered effect
    [...serviceCards, ...features, ...steps].forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
    });
}

function addStaggeredAnimation(element) {
    const siblings = element.parentElement.children;
    const index = Array.from(siblings).indexOf(element);
    element.style.transitionDelay = `${index * 0.1}s`;
}

// Interactive Elements
function initializeInteractiveElements() {
    // Enhanced button interactions with ripple effect
    document.querySelectorAll('.primary-btn, .cta-button').forEach(btn => {
        btn.addEventListener('click', function(e) {
            createRippleEffect(this, e);
        });
    });
    
    // Service card hover effects
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-15px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Feature icon rotation effect
    document.querySelectorAll('.feature').forEach(feature => {
        const icon = feature.querySelector('.feature-icon');
        
        feature.addEventListener('mouseenter', () => {
            icon.style.transform = 'rotate(0deg) scale(1.1)';
        });
        
        feature.addEventListener('mouseleave', () => {
            icon.style.transform = 'rotate(5deg) scale(1)';
        });
    });
    
    // Dynamic counter animation for numbers (if any)
    animateCounters();
}

function createRippleEffect(button, event) {
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    button.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

function animateCounters() {
    const counters = document.querySelectorAll('[data-count]');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60 FPS
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            counter.textContent = Math.floor(current);
        }, 16);
    });
}

// Form Handling
function initializeFormHandling() {
    const forms = document.querySelectorAll('form.contact-form');
    forms.forEach((form) => {
        form.addEventListener('submit', handleFormSubmission);

        const formInputs = form.querySelectorAll('input, select, textarea');
        formInputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => clearFieldError(input));
        });

        const textarea = form.querySelector('textarea');
        if (textarea) {
            textarea.addEventListener('input', autoResizeTextarea);
        }
    });
}

function handleFormSubmission(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const submitButton = form.querySelector('.form-submit-btn');
    const originalButtonText = submitButton ? submitButton.textContent : '';
    
    // Validate form
    if (!validateForm(form)) {
        showFormMessage('Please fill in all required fields correctly.', 'error');
        return;
    }
    
    // Show loading state
    setButtonLoading(submitButton, true);
    
    // Build payload for StaticForms
    const payload = Object.fromEntries(formData.entries());
    // Map apiKey -> accessKey if needed
    if (!payload.accessKey && payload.apiKey) {
        payload.accessKey = payload.apiKey;
    }
    // Ensure replyTo is set so emails are replyable
    if (!payload.replyTo) {
        payload.replyTo = payload.email ? payload.email : '@';
    }
    // Provide a default subject if not present
    if (!payload.subject) {
        payload.subject = document.title || 'New Form Submission';
    }

    const hasFiles = Array.from(form.querySelectorAll('input[type="file"]'))
        .some(input => input.files && input.files.length > 0);

    const endpoint = 'https://api.staticforms.xyz/submit';
    const requestInit = hasFiles ? {
        method: 'POST',
        body: (() => {
            const fd = new FormData();
            // Append all fields; StaticForms expects field names as provided
            Object.entries(payload).forEach(([key, value]) => fd.append(key, value));
            // Append files
            form.querySelectorAll('input[type="file"]').forEach(input => {
                Array.from(input.files || []).forEach(file => fd.append(input.name || 'attachments', file));
            });
            return fd;
        })()
    } : {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    };

    fetch(endpoint, requestInit)
    .then(async (resp) => {
        let resultText = 'Thank you! Your message has been sent.';
        try {
            const data = await resp.json();
            if (data && data.message) {
                resultText = data.message;
            }
        } catch (_) {}

        if (!resp.ok) {
            throw new Error(resultText || 'Submission failed');
        }

        showFormMessage(resultText, 'success');
        form.reset();
        setButtonLoading(submitButton, false, originalButtonText);
        trackFormSubmission(formData);

        const explicitRedirect = form.getAttribute('data-redirect');
        const hiddenRedirectInput = form.querySelector('input[name="redirectTo"]');
        let redirectTarget = explicitRedirect || (hiddenRedirectInput ? hiddenRedirectInput.value : '');
        // Fallback: if no redirect specified, send user back to the same page
        if (!redirectTarget) {
            redirectTarget = window.location.pathname || window.location.href;
        }
        if (redirectTarget) {
            setTimeout(() => {
                // Use full href when pathname is provided
                if (redirectTarget.startsWith('/')) {
                    window.location.href = redirectTarget;
                } else if (redirectTarget.match(/^https?:\/\//)) {
                    window.location.href = redirectTarget;
                } else {
                    // treat as relative
                    window.location.href = redirectTarget;
                }
            }, 1200);
        }
    })
    .catch((err) => {
        console.error('Form submission error:', err);
        setButtonLoading(submitButton, false, originalButtonText);
        showFormMessage('Sorry, we could not submit your form. Please try again or contact us directly.', 'error');
    });
}

function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const fieldType = field.type;
    let isValid = true;
    let errorMessage = '';
    
    // Check if required field is empty
    if (field.hasAttribute('required') && !value) {
        errorMessage = 'This field is required.';
        isValid = false;
    }
    // Email validation
    else if (fieldType === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            errorMessage = 'Please enter a valid email address.';
            isValid = false;
        }
    }
    // Phone validation
    else if (fieldType === 'tel' && value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value.replace(/\s/g, ''))) {
            errorMessage = 'Please enter a valid phone number.';
            isValid = false;
        }
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    } else {
        clearFieldError(field);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    field.style.borderColor = 'var(--error-red)';
    
    const errorElement = document.createElement('span');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.color = 'var(--error-red)';
    errorElement.style.fontSize = '0.875rem';
    errorElement.style.marginTop = '5px';
    
    field.parentElement.appendChild(errorElement);
}

function clearFieldError(field) {
    field.style.borderColor = '';
    const existingError = field.parentElement.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

function showFormMessage(message, type) {
    // Remove any existing messages
    const existingMessages = document.querySelectorAll('.form-message');
    existingMessages.forEach(msg => msg.remove());
    
    const messageElement = document.createElement('div');
    messageElement.className = `form-message ${type}`;
    messageElement.textContent = message;
    messageElement.style.display = 'block';
    
    const activeForm = document.activeElement && document.activeElement.form ? document.activeElement.form : document.querySelector('form.contact-form');
    if (activeForm) {
        activeForm.insertBefore(messageElement, activeForm.firstChild);
    } else {
        document.body.prepend(messageElement);
    }
    
    // Auto-hide success messages after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            messageElement.style.opacity = '0';
            setTimeout(() => messageElement.remove(), 300);
        }, 5000);
    }
}

function setButtonLoading(button, loading, originalText) {
    if (loading) {
        button.disabled = true;
        button.classList.add('loading');
        button.textContent = 'Sending...';
    } else {
        button.disabled = false;
        button.classList.remove('loading');
        // Restore original text if provided; fallback to common label
        if (originalText && originalText.trim().length > 0) {
            button.textContent = originalText;
        } else {
            button.textContent = 'Submit';
        }
    }
}

function autoResizeTextarea(e) {
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
}

function trackFormSubmission(formData) {
    // Implement analytics tracking here
    // Example: Google Analytics, Facebook Pixel, etc.
    console.log('Form submitted:', Object.fromEntries(formData));
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Performance Optimizations
const debouncedScrollHandler = debounce(() => {
    // Handle scroll events that don't need to run frequently
}, 100);

const throttledScrollHandler = throttle(() => {
    // Handle scroll events that need frequent updates
}, 16);

// Add scroll listeners with performance optimizations
window.addEventListener('scroll', throttledScrollHandler);
window.addEventListener('resize', debounce(() => {
    // Handle resize events
    window.dispatchEvent(new Event('scroll'));
}, 250));

// Error Handling
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
    // Implement error reporting here if needed
});

// Service Worker Registration (for PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateField,
        validateForm,
        createRippleEffect,
        debounce,
        throttle
    };
}
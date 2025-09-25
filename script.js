// Email validation and form handling
class EmailSignup {
    constructor() {
        this.form = document.getElementById('signup-form');
        this.emailInput = document.getElementById('email-input');
        this.errorMessage = document.getElementById('email-error');
        this.submitBtn = document.querySelector('.submit-btn');
        
        this.init();
    }
    
    init() {
        // Real-time email validation
        this.emailInput.addEventListener('input', () => this.validateEmail());
        this.emailInput.addEventListener('blur', () => this.validateEmail());
        
        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Clear error when user starts typing
        this.emailInput.addEventListener('focus', () => this.clearError());
    }
    
    validateEmail() {
        const email = this.emailInput.value.trim();
        
        // Don't show error if field is empty (let HTML5 validation handle required)
        if (!email) {
            this.clearError();
            return true;
        }
        
        // More comprehensive email regex
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        
        if (!emailRegex.test(email)) {
            this.showError('Please enter a valid email address');
            return false;
        }
        
        this.clearError();
        return true;
    }
    
    showError(message) {
        this.errorMessage.textContent = message;
        this.errorMessage.classList.add('show');
        this.emailInput.setAttribute('aria-invalid', 'true');
    }
    
    clearError() {
        this.errorMessage.textContent = '';
        this.errorMessage.classList.remove('show');
        this.emailInput.removeAttribute('aria-invalid');
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        // Validate before submission
        if (!this.validateEmail()) {
            this.emailInput.focus();
            return false;
        }
        
        // Show loading state
        this.setLoadingState(true);
        
        // Create FormData and submit
        const formData = new FormData(this.form);
        
        fetch(this.form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Network response was not ok');
        })
        .then(data => {
            this.handleSuccess();
        })
        .catch(error => {
            console.error('Error:', error);
            this.handleError();
        })
        .finally(() => {
            this.setLoadingState(false);
        });
        
        return false;
    }
    
    setLoadingState(loading) {
        if (loading) {
            this.submitBtn.classList.add('loading');
            this.submitBtn.disabled = true;
            this.emailInput.disabled = true;
        } else {
            this.submitBtn.classList.remove('loading');
            this.submitBtn.disabled = false;
            this.emailInput.disabled = false;
        }
    }
    
    handleSuccess() {
        // Replace form content with success message
        this.form.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: white;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">✓</div>
                <h2 style="margin-bottom: 1rem;">Thank You!</h2>
                <p>You'll be the first to know when we launch.</p>
            </div>
        `;
        
        // Optional: Analytics tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', 'signup', {
                'event_category': 'engagement',
                'event_label': 'email_signup'
            });
        }
    }
    
    handleError() {
        this.showError('Something went wrong. Please try again.');
        
        // Optional: Analytics tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', 'signup_error', {
                'event_category': 'error',
                'event_label': 'email_signup_failed'
            });
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new EmailSignup();
});

// Optional: Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Enter key focuses email input if not already focused
    if (e.key === 'Enter' && document.activeElement !== document.getElementById('email-input')) {
        e.preventDefault();
        document.getElementById('email-input').focus();
    }
});

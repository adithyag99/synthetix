// Google Sheets Web App URL
const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbw_ni-JHfr184SOeC3Tc_P_Zjh54pjgYHKctOtRC8SnjISE8k7-cZ8lNIOQRej7KZtL/exec';

// ===== Scroll Animation Observer =====
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
};

const animateOnScrollObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');

      // Check if this is a stat card with a number to animate
      const statNumber = entry.target.querySelector('.stat-number');
      if (statNumber && !statNumber.dataset.animated) {
        animateNumber(statNumber);
        statNumber.dataset.animated = 'true';
      }
    }
  });
}, observerOptions);

// Observe all animate-on-scroll elements
document.querySelectorAll('.animate-on-scroll').forEach(el => {
  animateOnScrollObserver.observe(el);
});

// ===== Number Counting Animation =====
function animateNumber(element) {
  const target = parseInt(element.dataset.target);
  const prefix = element.dataset.prefix || '';
  const suffix = element.dataset.suffix || '';
  const duration = 2000; // 2 seconds
  const startTime = performance.now();

  function updateNumber(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Easing function for smooth animation
    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
    const currentValue = Math.floor(easeOutQuart * target);

    element.textContent = prefix + currentValue + suffix;

    if (progress < 1) {
      requestAnimationFrame(updateNumber);
    } else {
      element.textContent = prefix + target + suffix;
    }
  }

  requestAnimationFrame(updateNumber);
}

// ===== Form Handling =====
function setupForm(formId, emailId, submitId) {
  const form = document.getElementById(formId);
  const emailInput = document.getElementById(emailId);
  const submitBtn = document.getElementById(submitId);

  if (!form || !emailInput || !submitBtn) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    if (!email) return;

    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('source', formId);
      formData.append('timestamp', new Date().toISOString());

      await fetch(GOOGLE_SHEET_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: formData,
      });

      // Show success state
      submitBtn.classList.remove('loading');
      submitBtn.classList.add('success');

      // Clear input
      emailInput.value = '';

      // Reset button after delay
      setTimeout(() => {
        submitBtn.classList.remove('success');
        submitBtn.disabled = false;
      }, 3000);

    } catch (error) {
      console.error('Error submitting email:', error);

      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;

      // Show error feedback
      emailInput.style.borderColor = 'var(--color-error)';
      setTimeout(() => {
        emailInput.style.borderColor = '';
      }, 2000);
    }
  });

  // Real-time validation feedback
  emailInput.addEventListener('input', () => {
    if (emailInput.validity.valid && emailInput.value.length > 0) {
      emailInput.style.borderColor = 'var(--color-success)';
    } else if (emailInput.value.length > 0) {
      emailInput.style.borderColor = 'var(--color-error)';
    } else {
      emailInput.style.borderColor = '';
    }
  });

  emailInput.addEventListener('blur', () => {
    if (emailInput.value.length === 0) {
      emailInput.style.borderColor = '';
    }
  });
}

// Initialize forms
setupForm('hero-form', 'hero-email', 'hero-submit');
setupForm('cta-form', 'cta-email', 'cta-submit');

// ===== Navigation Visibility Logic =====
const heroEmailInput = document.getElementById('hero-email');
const nav = document.querySelector('.nav');

if (heroEmailInput && nav) {
  const navObserverOptions = {
    root: null,
    threshold: 0,
    rootMargin: '0px'
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // If the email input is NOT intersecting (scrolled past or out of view)
      // and we are below the top of the input, show the nav
      if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
        nav.classList.add('nav-visible');
      } else {
        nav.classList.remove('nav-visible');
      }
    });
  }, navObserverOptions);

  navObserver.observe(heroEmailInput);
}

window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;

  if (currentScrollY > 50) {
    nav.classList.add('nav-scrolled');
  } else {
    nav.classList.remove('nav-scrolled');
  }
}, { passive: true });

// ===== Smooth Scroll for Anchor Links =====
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

// ===== Parallax Effect for Hero Background =====
const heroGradient = document.querySelector('.hero-gradient');
const heroMesh = document.querySelector('.hero-mesh');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const heroHeight = document.querySelector('.hero').offsetHeight;

  if (scrollY < heroHeight) {
    const parallaxAmount = scrollY * 0.3;
    if (heroGradient) {
      heroGradient.style.transform = `translate(0, ${parallaxAmount}px)`;
    }
    if (heroMesh) {
      heroMesh.style.transform = `translate(0, ${parallaxAmount * 0.5}px)`;
    }
  }
}, { passive: true });

// ===== Add Hover Effect Sounds (Optional - Visual Feedback) =====
// Hover state is now handled exclusively via CSS for better performance and consistency.

// ===== Initialize All Visible Elements on Load =====
document.addEventListener('DOMContentLoaded', () => {
  // Trigger animations for elements already in view
  setTimeout(() => {
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('visible');

        // Animate numbers if in view
        const statNumber = el.querySelector('.stat-number');
        if (statNumber && !statNumber.dataset.animated) {
          animateNumber(statNumber);
          statNumber.dataset.animated = 'true';
        }
      }
    });
  }, 100);
});

// ===== Use Case Card Interaction Enhancement =====
document.querySelectorAll('.usecase-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.zIndex = '10';
  });

  card.addEventListener('mouseleave', () => {
    card.style.zIndex = '';
  });
});

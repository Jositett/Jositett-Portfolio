document.addEventListener('DOMContentLoaded', () => {
  // Theme Toggle Functionality
  const themeToggle = document.getElementById('theme-switcher');
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  const currentTheme = localStorage.getItem('theme');

  const sunIcon = '<i class="fas fa-sun"></i>';
  const moonIcon = '<i class="fas fa-moon"></i>';

  function setTheme(theme) {
    if (themeToggle) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
      themeToggle.innerHTML = theme === 'dark' ? sunIcon : moonIcon;
    }
  }

  // Set initial theme
  if (currentTheme === 'dark' || (!currentTheme && prefersDarkScheme.matches)) {
    setTheme('dark');
  } else {
    setTheme('light');
  }

  // Toggle theme on button click
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
    });
  }

  // Mobile menu toggle
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking on a nav link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }

  // Update current year in footer
  const currentYearEl = document.getElementById('current-year');
  if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80, // Adjust for fixed header
          behavior: 'smooth'
        });
        
        // Update URL without page jump
        if (history.pushState) {
          history.pushState(null, null, targetId);
        } else {
          location.hash = targetId;
        }
      }
    });
  });

  // Formspree form handling
  const form = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (form && formStatus) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

      try {
        const formData = new FormData(form);
        const response = await fetch(form.action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          formStatus.textContent = 'Thank you for your message! I will get back to you soon.';
          formStatus.className = 'form-status success';
          form.reset();
        } else {
          const data = await response.json();
          throw new Error(data.error || 'Form submission failed');
        }
      } catch (error) {
        formStatus.textContent = 'Oops! There was a problem sending your message. Please try again later.';
        formStatus.className = 'form-status error';
        console.error('Form submission error:', error);
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;

        formStatus.scrollIntoView({ behavior: 'smooth', block: 'center' });

        setTimeout(() => {
          formStatus.textContent = '';
          formStatus.className = 'form-status';
        }, 10000);
      }
    });
  }
});
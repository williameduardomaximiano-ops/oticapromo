document.addEventListener('DOMContentLoaded', () => {
  // Navbar scroll effect
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  // Mobile menu
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileMenuClose = document.querySelector('.mobile-menu-close');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }

  if (mobileMenuClose && mobileMenu) {
    mobileMenuClose.addEventListener('click', () => {
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // Parallax hero
  const heroBg = document.querySelector('.hero-bg img');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      if (scrolled < window.innerHeight) {
        heroBg.style.transform = `translateY(${scrolled * 0.3}px) scale(1.05)`;
      }
    });
  }

  // Scroll animations
  const animateElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .scale-in');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 100);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  animateElements.forEach(el => observer.observe(el));

  // Animated counter
  const counters = document.querySelectorAll('[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'));
        const suffix = el.getAttribute('data-suffix') || '';
        const prefix = el.getAttribute('data-prefix') || '';
        const duration = 2000;
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          el.textContent = prefix + Math.floor(current).toLocaleString('pt-BR') + suffix;
        }, 16);

        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => counterObserver.observe(el));

  // Countdown timer
  const countdownEl = document.getElementById('countdown');
  if (countdownEl) {
    const storageKey = 'oticapromo_countdown_end';
    let endTime = localStorage.getItem(storageKey);

    if (!endTime || Date.now() > parseInt(endTime)) {
      endTime = Date.now() + 3 * 24 * 60 * 60 * 1000;
      localStorage.setItem(storageKey, endTime);
    } else {
      endTime = parseInt(endTime);
    }

    function updateCountdown() {
      const now = Date.now();
      const diff = Math.max(0, endTime - now);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      const items = countdownEl.querySelectorAll('.countdown-item');
      if (items.length >= 4) {
        const values = [days, hours, minutes, seconds];
        items.forEach((item, i) => {
          const valEl = item.querySelector('.countdown-value');
          const newVal = String(values[i]).padStart(2, '0');
          if (valEl.textContent !== newVal) {
            valEl.textContent = newVal;
            valEl.classList.add('pulse');
            setTimeout(() => valEl.classList.remove('pulse'), 500);
          }
        });
      }
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  // Floating WhatsApp button
  const whatsappFloat = document.querySelector('.whatsapp-float');
  if (whatsappFloat) {
    // Show immediately on mobile, after scroll on desktop
    if (window.innerWidth <= 768) {
      whatsappFloat.style.opacity = '1';
      whatsappFloat.style.transform = 'scale(1)';
    } else {
      window.addEventListener('scroll', () => {
        const visible = window.scrollY > 200;
        whatsappFloat.style.opacity = visible ? '1' : '0';
        whatsappFloat.style.transform = visible ? 'scale(1)' : 'scale(0)';
      });
    }
  }

  // FAQ accordion
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isActive = item.classList.contains('active');

      // Close all
      document.querySelectorAll('.faq-item.active').forEach(openItem => {
        openItem.classList.remove('active');
      });

      // Toggle current
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // Exit popup
  const popupOverlay = document.querySelector('.exit-popup-overlay');
  if (popupOverlay) {
    let popupShown = sessionStorage.getItem('popup_shown');

    document.addEventListener('mouseout', (e) => {
      if (!popupShown && e.clientY < 5) {
        popupOverlay.classList.add('active');
        sessionStorage.setItem('popup_shown', 'true');
        popupShown = true;
      }
    });

    // Also show after 45 seconds
    setTimeout(() => {
      if (!popupShown) {
        popupOverlay.classList.add('active');
        sessionStorage.setItem('popup_shown', 'true');
        popupShown = true;
      }
    }, 45000);

    // Close popup
    const closeBtn = popupOverlay.querySelector('.exit-popup-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        popupOverlay.classList.remove('active');
      });
    }

    popupOverlay.addEventListener('click', (e) => {
      if (e.target === popupOverlay) {
        popupOverlay.classList.remove('active');
      }
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});

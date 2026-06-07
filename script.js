/* ============================================================
   ROMAN — Portfolio JavaScript
   Handles: scroll reveals, typed effect, nav behavior, mobile menu
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  /* ----------------------------------------------------------
     1. INTERSECTION OBSERVER — Scroll Reveal
     ---------------------------------------------------------- */
  const revealElements = document.querySelectorAll('.reveal-up');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target); // animate once
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  /* ----------------------------------------------------------
     2. NAVBAR — Scroll Style + Active Section Tracking
     ---------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('.section, .hero');
  const navLinks = document.querySelectorAll('.nav-link');

  // Throttled scroll handler
  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        // Toggle .scrolled class
        navbar.classList.toggle('scrolled', window.scrollY > 40);

        // Highlight active nav link
        let currentSection = '';
        sections.forEach((section) => {
          const sectionTop = section.offsetTop - 120;
          if (window.scrollY >= sectionTop) {
            currentSection = section.getAttribute('id');
          }
        });

        navLinks.forEach((link) => {
          link.classList.toggle(
            'active',
            link.getAttribute('href') === `#${currentSection}`
          );
        });

        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  /* ----------------------------------------------------------
     3. MOBILE NAV TOGGLE
     ---------------------------------------------------------- */
  const navToggle = document.getElementById('nav-toggle');
  const navLinksContainer = document.getElementById('nav-links');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinksContainer.classList.toggle('open');
  });

  // Close mobile menu when a link is clicked
  navLinksContainer.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinksContainer.classList.remove('open');
    });
  });

  /* ----------------------------------------------------------
     4. TYPING EFFECT — Hero Subtitle
     ---------------------------------------------------------- */
  const typedTextEl = document.getElementById('typed-text');
  const phrases = [
    'IT Student & Passionate Developer.',
    'UNIX Enthusiast.',
    'Open Source Advocate.',
    'Arch Linux Aficionado.',
    'Building the Future, One Commit at a Time.',
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 65;

  function typeEffect() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      typedTextEl.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 35;
    } else {
      typedTextEl.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 65;
    }

    // Finished typing current phrase
    if (!isDeleting && charIndex === currentPhrase.length) {
      isDeleting = true;
      typeSpeed = 2000; // pause before deleting
    }

    // Finished deleting
    if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typeSpeed = 400; // brief pause before next phrase
    }

    setTimeout(typeEffect, typeSpeed);
  }

  // Start typing after initial reveal delay
  setTimeout(typeEffect, 800);

  /* ----------------------------------------------------------
     5. SMOOTH ANCHOR SCROLL (fallback for older browsers)
     ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* ----------------------------------------------------------
     6. PARALLAX GLOW MOVEMENT (subtle, desktop only)
     ---------------------------------------------------------- */
  if (window.matchMedia('(min-width: 768px)').matches) {
    const glows = document.querySelectorAll('.hero-glow');

    window.addEventListener(
      'mousemove',
      (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
        const y = (e.clientY / window.innerHeight - 0.5) * 2;

        glows.forEach((glow, i) => {
          const factor = (i + 1) * 12;
          glow.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
        });
      },
      { passive: true }
    );
  }
});

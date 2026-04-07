/* ============================================
   Workshop Interactivity
   — Scroll spy, copy buttons, progress, sidebar
   ============================================ */

(function () {
  'use strict';

  // --- Scroll Spy ---
  const sections = document.querySelectorAll('.workshop-section[id]');
  const navLinks = document.querySelectorAll('.sidebar-nav a[href^="#"]');
  const progressFill = document.querySelector('.progress-bar-fill');
  const progressText = document.querySelector('.progress-text');
  const sectionIds = Array.from(sections).map(s => s.id);

  function updateScrollSpy() {
    const scrollY = window.scrollY + 120;
    let currentId = sectionIds[0];

    for (const section of sections) {
      if (section.offsetTop <= scrollY) {
        currentId = section.id;
      }
    }

    navLinks.forEach(link => {
      const href = link.getAttribute('href').slice(1);
      link.classList.toggle('active', href === currentId);
    });

    // Progress
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? Math.min((window.scrollY / docHeight) * 100, 100) : 0;
    if (progressFill) progressFill.style.width = scrollPercent + '%';

    // Section progress text
    const currentIndex = sectionIds.indexOf(currentId);
    if (progressText && currentIndex >= 0) {
      progressText.textContent = `Section ${currentIndex + 1} of ${sectionIds.length}`;
    }
  }

  let scrollTicking = false;
  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      requestAnimationFrame(() => {
        updateScrollSpy();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  });

  updateScrollSpy();

  // --- Copy Buttons (code blocks) ---
  document.querySelectorAll('.code-block').forEach(block => {
    const btn = block.querySelector('.copy-btn');
    const code = block.querySelector('code');
    if (!btn || !code) return;

    btn.addEventListener('click', () => {
      const text = code.textContent;
      navigator.clipboard.writeText(text).then(() => {
        btn.textContent = 'Copied!';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.textContent = 'Copy';
          btn.classList.remove('copied');
        }, 2000);
      });
    });
  });

  // --- Inline Copyable Values ---
  document.querySelectorAll('code.copyable').forEach(el => {
    el.setAttribute('data-tooltip', 'Click to copy');

    el.addEventListener('click', () => {
      const text = el.textContent;
      navigator.clipboard.writeText(text).then(() => {
        el.classList.add('copied');
        el.setAttribute('data-tooltip', 'Copied!');
        setTimeout(() => {
          el.classList.remove('copied');
          el.setAttribute('data-tooltip', 'Click to copy');
        }, 1500);
      });
    });
  });

  // --- Mobile Sidebar Toggle ---
  const menuToggle = document.querySelector('.menu-toggle');
  const sidebar = document.querySelector('.sidebar');

  if (menuToggle && sidebar) {
    menuToggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });

    // Close sidebar on link click (mobile)
    sidebar.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 900) {
          sidebar.classList.remove('open');
        }
      });
    });

    // Close sidebar on outside click
    document.addEventListener('click', (e) => {
      if (window.innerWidth <= 900 &&
          sidebar.classList.contains('open') &&
          !sidebar.contains(e.target) &&
          !menuToggle.contains(e.target)) {
        sidebar.classList.remove('open');
      }
    });
  }

  // --- Smooth scroll for nav links (fallback) ---
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

})();

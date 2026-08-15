(function () {
  const header = document.getElementById('siteHeader');
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  const navBackdrop = document.getElementById('navBackdrop');
  const yearEl = document.getElementById('year');

  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const onScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  if (navToggle && mainNav) {
    const openNav = () => {
      mainNav.classList.add('open');
      navToggle.classList.add('active');
      navToggle.setAttribute('aria-expanded', 'true');
      navToggle.setAttribute('aria-label', 'Menü schliessen');
      if (navBackdrop) {
        navBackdrop.hidden = false;
        requestAnimationFrame(() => navBackdrop.classList.add('visible'));
      }
      document.body.classList.add('nav-open-lock');
    };

    const closeNav = () => {
      mainNav.classList.remove('open');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Menü öffnen');
      if (navBackdrop) {
        navBackdrop.classList.remove('visible');
        setTimeout(() => { navBackdrop.hidden = true; }, 300);
      }
      document.body.classList.remove('nav-open-lock');
    };

    navToggle.addEventListener('click', () => {
      if (mainNav.classList.contains('open')) {
        closeNav();
      } else {
        openNav();
      }
    });

    mainNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeNav);
    });

    if (navBackdrop) {
      navBackdrop.addEventListener('click', closeNav);
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mainNav.classList.contains('open')) {
        closeNav();
        navToggle.focus();
      }
    });
  }

  const openStatusEls = document.querySelectorAll('[data-open-status]');
  if (openStatusEls.length) {
    const hours = {
      1: [[8 * 60, 12 * 60], [13 * 60 + 30, 18 * 60]],
      2: [[8 * 60, 12 * 60], [13 * 60 + 30, 18 * 60]],
      3: [],
      4: [[8 * 60, 12 * 60], [13 * 60 + 30, 18 * 60]],
      5: [[8 * 60, 12 * 60], [13 * 60 + 30, 18 * 60]],
      6: [[8 * 60, 16 * 60]],
      0: [],
    };
    const now = new Date();
    const minutesNow = now.getHours() * 60 + now.getMinutes();
    const todaysRanges = hours[now.getDay()] || [];
    const isOpen = todaysRanges.some(([start, end]) => minutesNow >= start && minutesNow < end);

    openStatusEls.forEach((el) => {
      el.classList.toggle('is-closed', !isOpen);
      const dot = document.createElement('span');
      dot.className = 'dot';
      const label = document.createElement('span');
      label.textContent = isOpen ? 'Jetzt geöffnet' : 'Aktuell geschlossen';
      el.innerHTML = '';
      el.appendChild(dot);
      el.appendChild(label);
    });
  }

  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  const form = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.name.value.trim();
      const phone = form.phone.value.trim();
      const email = form.email.value.trim();
      const message = form.message.value.trim();

      if (!name || !email || !message) {
        formNote.textContent = 'Bitte füllen Sie alle Pflichtfelder aus.';
        return;
      }

      const body = [
        `Name: ${name}`,
        phone ? `Telefon: ${phone}` : null,
        `E-Mail: ${email}`,
        '',
        message,
      ].filter(Boolean).join('\n');

      const mailto = `mailto:bluetenhandwerk@bluewin.ch?subject=${encodeURIComponent(
        'Anfrage über die Website'
      )}&body=${encodeURIComponent(body)}`;

      window.location.href = mailto;
      formNote.textContent = 'Ihr E-Mail-Programm wird geöffnet …';
    });
  }
})();

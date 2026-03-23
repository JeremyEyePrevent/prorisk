/**
 * ProRisk — main.js
 * Scripts vanilla : navigation mobile, scroll actif, animations, formulaire
 */

'use strict';

/* ============================================================
   UTILITAIRES
   ============================================================ */

/** Sélecteur court */
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

/* ============================================================
   HEADER — SCROLL & BURGER
   ============================================================ */

const header  = $('#header');
const burger  = $('#burger');
const nav     = $('#nav');

/** Ajoute/retire la classe scrolled selon la position de défilement */
function updateHeaderScroll() {
  header.classList.toggle('is-scrolled', window.scrollY > 20);
}

/** Ouvre / ferme le menu mobile */
function toggleMobileMenu() {
  const isOpen = nav.classList.toggle('is-open');
  burger.setAttribute('aria-expanded', String(isOpen));

  // Empêche le scroll du body quand le menu est ouvert
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

/** Ferme le menu mobile */
function closeMobileMenu() {
  nav.classList.remove('is-open');
  burger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

window.addEventListener('scroll', updateHeaderScroll, { passive: true });
burger.addEventListener('click', toggleMobileMenu);

// Ferme le menu si on clique sur un lien de navigation
$$('.nav__link').forEach(link => {
  link.addEventListener('click', closeMobileMenu);
});

// Ferme le menu sur Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMobileMenu();
});

// Initialisation au chargement
updateHeaderScroll();

/* ============================================================
   NAVIGATION — LIEN ACTIF AU SCROLL
   ============================================================ */

const sections  = $$('section[id]');
const navLinks  = $$('.nav__link[href^="#"]');

/**
 * Met à jour le lien de nav actif selon la section visible.
 * Utilise IntersectionObserver pour la performance.
 */
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      navLinks.forEach(link => {
        const isActive = link.getAttribute('href') === `#${entry.target.id}`;
        link.classList.toggle('is-active', isActive && !link.classList.contains('nav__link--cta'));
      });
    });
  },
  {
    rootMargin: `-${getComputedStyle(document.documentElement)
      .getPropertyValue('--header-height')
      .trim()} 0px -60% 0px`,
  }
);

sections.forEach(section => sectionObserver.observe(section));

/* ============================================================
   ANIMATIONS — REVEAL AU SCROLL
   ============================================================ */

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (!entry.isIntersecting) return;

      // Délai en cascade pour les éléments dans une grille
      const siblings = $$('.reveal', entry.target.parentElement);
      const index    = siblings.indexOf(entry.target);
      const delay    = index * 80;

      setTimeout(() => {
        entry.target.classList.add('is-visible');
      }, delay);

      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

$$('.reveal').forEach(el => revealObserver.observe(el));

/* ============================================================
   FOOTER — ANNÉE DYNAMIQUE
   ============================================================ */

const yearEl = $('#footer-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ============================================================
   FORMULAIRE DE CONTACT
   ============================================================ */

const form     = $('#contact-form');
const feedback = $('#form-feedback');
const submitBtn = $('#submit-btn');

/**
 * Affiche un message de retour dans le bloc feedback.
 * @param {string} message
 * @param {'success'|'error'} type
 */
function showFeedback(message, type) {
  feedback.textContent = message;
  feedback.className   = `form__feedback form__feedback--${type}`;
  feedback.removeAttribute('hidden');
  feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  // Cache le message après 7 secondes
  setTimeout(() => {
    feedback.setAttribute('hidden', '');
    feedback.textContent = '';
  }, 7000);
}

/** Validation simple côté client */
function validateForm(formData) {
  const required = ['prenom', 'nom', 'email', 'entreprise', 'besoin'];
  for (const field of required) {
    if (!formData.get(field)?.trim()) {
      return `Le champ "${field}" est obligatoire.`;
    }
  }

  const email = formData.get('email');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return 'Veuillez saisir une adresse email valide.';
  }

  return null; // OK
}

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    // Validation
    const error = validateForm(formData);
    if (error) {
      showFeedback(error, 'error');
      return;
    }

    // État chargement
    submitBtn.disabled    = true;
    submitBtn.textContent = 'Envoi en cours…';

    try {
      const response = await fetch(form.action, {
        method:  'POST',
        body:    formData,
        headers: { 'Accept': 'application/json' },
      });

      if (response.ok) {
        showFeedback(
          '✅ Message envoyé ! Nous vous répondrons sous 24 h.',
          'success'
        );
        form.reset();
      } else {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.error || 'Erreur serveur');
      }
    } catch (err) {
      console.error('Erreur formulaire :', err);
      showFeedback(
        '❌ Une erreur est survenue. Merci de réessayer ou de nous contacter par téléphone.',
        'error'
      );
    } finally {
      submitBtn.disabled    = false;
      submitBtn.textContent = 'Envoyer ma demande';
    }
  });
}

/* ============================================================
   GALERIE — LIGHTBOX SIMPLE (optionnel)
   ============================================================ */

/**
 * Lightbox minimaliste au clic sur une image de galerie.
 * Remplace les placeholders par de vraies images quand elles seront ajoutées.
 */
function initLightbox() {
  const items = $$('.galerie__item');
  if (!items.length) return;

  // Crée l'overlay
  const overlay = document.createElement('div');
  overlay.id             = 'lightbox-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Aperçu de l\'image');
  overlay.style.cssText  = `
    display: none;
    position: fixed;
    inset: 0;
    z-index: 9999;
    background: rgba(0,0,0,.88);
    align-items: center;
    justify-content: center;
    cursor: zoom-out;
    padding: 1rem;
  `;

  const caption = document.createElement('p');
  caption.style.cssText = `
    position: absolute;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    color: rgba(255,255,255,.8);
    font-size: .9rem;
    text-align: center;
  `;
  overlay.appendChild(caption);

  document.body.appendChild(overlay);

  function openLightbox(item) {
    const fig  = item.querySelector('figcaption');
    caption.textContent = fig ? fig.textContent : '';
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    overlay.focus();
  }

  function closeLightbox() {
    overlay.style.display = 'none';
    document.body.style.overflow = '';
  }

  items.forEach(item => {
    item.addEventListener('click', () => openLightbox(item));
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(item);
      }
    });
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
  });

  overlay.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.style.display === 'flex') closeLightbox();
  });
}

initLightbox();

/* ============================================================
   SMOOTH SCROLL — FALLBACK navigateurs anciens
   ============================================================ */

// CSS scroll-behavior: smooth suffit pour les navigateurs modernes.
// Ce fallback gère les ancres pour les cas où CSS n'est pas supporté.
if (!CSS.supports('scroll-behavior', 'smooth')) {
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.getElementById(anchor.getAttribute('href').slice(1));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

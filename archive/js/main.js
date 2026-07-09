/* ============================================================
   AMAN SHARMA — PORTFOLIO 2026
   Application JavaScript
   Modular, class-based architecture
   ============================================================ */

"use strict";

/* ----- 1. CUSTOM CURSOR ----- */
class CustomCursor {
  constructor() {
    this.dot  = document.querySelector(".cursor");
    this.ring = document.querySelector(".cursor-ring");
    this.mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    this.ringPos = { ...this.mouse };

    this._bindEvents();
    this._animate();
  }

  _bindEvents() {
    window.addEventListener("mousemove", (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      this.dot.style.left = `${this.mouse.x}px`;
      this.dot.style.top  = `${this.mouse.y}px`;
    });

    const hoverTargets = "a, button, input, textarea, .stat-grid__item, .skill-cat, .edu-card, .stat-card, .timeline__item, .carousel__dot";
    document.querySelectorAll(hoverTargets).forEach((el) => {
      el.addEventListener("mouseenter", () => this._setHover(true));
      el.addEventListener("mouseleave", () => this._setHover(false));
    });
  }

  _setHover(active) {
    this.dot.classList.toggle("hover", active);
    this.ring.classList.toggle("hover", active);
  }

  _animate() {
    const lerp = 0.15;
    this.ringPos.x += (this.mouse.x - this.ringPos.x) * lerp;
    this.ringPos.y += (this.mouse.y - this.ringPos.y) * lerp;
    this.ring.style.left = `${this.ringPos.x}px`;
    this.ring.style.top  = `${this.ringPos.y}px`;
    requestAnimationFrame(() => this._animate());
  }
}


/* ----- 2. PARTICLE FIELD ----- */
class ParticleField {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx    = this.canvas.getContext("2d");
    this.dpr    = window.devicePixelRatio || 1;
    this.particles = [];

    this.LINK_DISTANCE = 140;
    this.MAX_PARTICLES = 80;
    this.PARTICLE_DENSITY = 25000;

    this._resize();
    this._createParticles();
    this._draw();

    window.addEventListener("resize", () => this._resize());
  }

  _resize() {
    this.w = this.canvas.width  = this.canvas.offsetWidth  * this.dpr;
    this.h = this.canvas.height = this.canvas.offsetHeight * this.dpr;
  }

  _createParticles() {
    const count = Math.min(this.MAX_PARTICLES, Math.floor((this.w * this.h) / this.PARTICLE_DENSITY));
    this.particles = Array.from({ length: count }, () => ({
      x:  Math.random() * this.w,
      y:  Math.random() * this.h,
      vx: (Math.random() - 0.5) * 0.3 * this.dpr,
      vy: (Math.random() - 0.5) * 0.3 * this.dpr,
      r:  Math.random() * 1.5 + 0.5,
      o:  Math.random() * 0.5 + 0.2,
    }));
  }

  _draw() {
    this.ctx.clearRect(0, 0, this.w, this.h);
    this._drawLinks();
    this._drawDots();
    requestAnimationFrame(() => this._draw());
  }

  _drawLinks() {
    const maxDist = this.LINK_DISTANCE * this.dpr;

    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const dist = Math.hypot(dx, dy);

        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.15;
          this.ctx.strokeStyle = `rgba(200, 255, 46, ${alpha})`;
          this.ctx.lineWidth = 1 * this.dpr;
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
        }
      }
    }
  }

  _drawDots() {
    for (const p of this.particles) {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > this.w) p.vx *= -1;
      if (p.y < 0 || p.y > this.h) p.vy *= -1;

      this.ctx.fillStyle = `rgba(200, 255, 46, ${p.o})`;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.r * this.dpr, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }
}


/* ----- 3. TYPEWRITER ----- */
class Typewriter {
  constructor(elementId, phrases) {
    this.el = document.getElementById(elementId);
    this.phrases = phrases;
    this.caret = '<span class="caret"></span>';
    this.phraseIndex = 0;
    this.charIndex = 0;
    this.deleting = false;

    this.TYPE_SPEED   = 40;
    this.DELETE_SPEED = 20;
    this.PAUSE_BEFORE_DELETE = 2200;
    this.PAUSE_BEFORE_TYPE   = 200;

    setTimeout(() => this._tick(), 1200);
  }

  _tick() {
    const current = this.phrases[this.phraseIndex];

    if (!this.deleting) {
      this.el.innerHTML = current.slice(0, this.charIndex) + this.caret;
      this.charIndex++;

      if (this.charIndex > current.length) {
        this.deleting = true;
        setTimeout(() => this._tick(), this.PAUSE_BEFORE_DELETE);
        return;
      }
      setTimeout(() => this._tick(), this.TYPE_SPEED);
    } else {
      this.el.innerHTML = current.slice(0, this.charIndex) + this.caret;
      this.charIndex--;

      if (this.charIndex < 0) {
        this.deleting = false;
        this.phraseIndex = (this.phraseIndex + 1) % this.phrases.length;
        setTimeout(() => this._tick(), this.PAUSE_BEFORE_TYPE);
        return;
      }
      setTimeout(() => this._tick(), this.DELETE_SPEED);
    }
  }
}


/* ----- 4. SCROLL PROGRESS ----- */
class ScrollProgress {
  constructor(elementId) {
    this.bar = document.getElementById(elementId);
    window.addEventListener("scroll", () => this._update());
  }

  _update() {
    const scrollTop = window.scrollY;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const pct = (scrollTop / docHeight) * 100;
    this.bar.style.width = `${pct}%`;
  }
}


/* ----- 5. SCROLL REVEAL ----- */
class ScrollReveal {
  constructor() {
    this.observer = new IntersectionObserver(
      (entries) => this._onIntersect(entries),
      { threshold: 0.15 }
    );

    document.querySelectorAll(".reveal").forEach((el) => {
      this.observer.observe(el);
    });
  }

  _onIntersect(entries) {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add("in");

      // Trigger stat-grid counters (reveal is on parent .stat-grid)
      entry.target.querySelectorAll(".stat-grid__number").forEach((numEl) => {
        if (!numEl.dataset.done) {
          CounterAnimator.animateDecimal(numEl);
          numEl.dataset.done = "1";
        }
      });

      // Trigger stat-card counters & LC bars
      entry.target.querySelectorAll(".counter").forEach((c) => {
        if (!c.dataset.done) {
          CounterAnimator.animateInteger(c);
          c.dataset.done = "1";
        }
      });

      entry.target.querySelectorAll(".lc-item__fill").forEach((bar) => {
        bar.style.width = `${bar.dataset.w}%`;
      });

      this.observer.unobserve(entry.target);
    });
  }
}


/* ----- 6. COUNTER ANIMATIONS ----- */
const CounterAnimator = {
  DURATION: 1600,

  /**
   * Animate a stat-grid counter (supports decimals and "+" suffix).
   */
  animateDecimal(el) {
    const target  = parseFloat(el.dataset.target);
    const decimal = parseInt(el.dataset.decimal || "0", 10);
    const hasPlus = el.innerHTML.includes("+");
    const start   = performance.now();

    const tick = (now) => {
      const progress = Math.min(1, (now - start) / this.DURATION);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const value = target * eased;
      const display = decimal ? value.toFixed(decimal) : Math.floor(value);
      el.innerHTML = display + (hasPlus ? "<sup>+</sup>" : "");
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  },

  /**
   * Animate a simple integer counter.
   */
  animateInteger(el) {
    const target = parseInt(el.dataset.target, 10);
    const start  = performance.now();

    const tick = (now) => {
      const progress = Math.min(1, (now - start) / this.DURATION);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(target * eased);
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  },
};


/* ----- 7. PROJECT CAROUSEL ----- */
class ProjectCarousel {
  constructor() {
    this.slidesEl   = document.getElementById("slides");
    this.dots       = document.querySelectorAll(".carousel__dot");
    this.totalSlides = 3;
    this.current     = parseInt(localStorage.getItem("as_slide") || "0", 10);

    this._bindEvents();
    this.goTo(this.current);
  }

  _bindEvents() {
    document.getElementById("prev").addEventListener("click", () => this.prev());
    document.getElementById("next").addEventListener("click", () => this.next());

    this.dots.forEach((dot) => {
      dot.addEventListener("click", () => {
        this.goTo(parseInt(dot.dataset.idx, 10));
      });
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft")  this.prev();
      if (e.key === "ArrowRight") this.next();
    });
  }

  goTo(index) {
    this.current = ((index % this.totalSlides) + this.totalSlides) % this.totalSlides;
    this.slidesEl.style.transform = `translateX(-${this.current * 100}%)`;

    this.dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === this.current);
    });

    localStorage.setItem("as_slide", this.current);
  }

  next() { this.goTo(this.current + 1); }
  prev() { this.goTo(this.current - 1); }
}


/* ----- 8. CONTRIBUTION GRID ----- */
class ContribGrid {
  constructor(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const totalCells = 26 * 7; // 26 weeks × 7 days

    const levels = [
      { threshold: 0.85, className: "contrib-grid__cell--l4" },
      { threshold: 0.65, className: "contrib-grid__cell--l3" },
      { threshold: 0.40, className: "contrib-grid__cell--l2" },
      { threshold: 0.20, className: "contrib-grid__cell--l1" },
    ];

    const fragment = document.createDocumentFragment();

    for (let i = 0; i < totalCells; i++) {
      const cell = document.createElement("div");
      const rand = Math.random();
      const level = levels.find((l) => rand > l.threshold);

      cell.className = "contrib-grid__cell" + (level ? ` ${level.className}` : "");
      fragment.appendChild(cell);
    }

    container.appendChild(fragment);
  }
}


/* ----- 9. CONTACT FORM ----- */
class ContactForm {
  constructor(formElement) {
    this.form = formElement;
    this.form.addEventListener("submit", (e) => this._handleSubmit(e));
  }

  _handleSubmit(e) {
    e.preventDefault();

    const btn = this.form.querySelector(".form__submit");
    const originalHTML = btn.innerHTML;

    btn.innerHTML = "✓ sent — I'll reply within 24h";
    btn.style.background = "var(--cyan)";

    setTimeout(() => {
      btn.innerHTML = originalHTML;
      btn.style.background = "";
      this.form.reset();
    }, 3000);
  }
}


/* ----- 10. RESUME BUTTON ----- */
class ResumeButton {
  constructor(elementId) {
    const btn = document.getElementById(elementId);
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const original = btn.innerHTML;
      btn.innerHTML = "coming soon ✓";
      setTimeout(() => { btn.innerHTML = original; }, 2000);
    });
  }
}


/* ============================================================
   INITIALIZATION
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  // Core systems
  new CustomCursor();
  new ParticleField("particles");
  new ScrollProgress("progress");
  new ScrollReveal();

  // Hero
  new Typewriter("typed", [
    "> Full-stack developer & data analyst.",
    "> Building REST APIs, ETL pipelines, ML systems.",
    "> Certified in Oracle Cloud AI Foundations.",
    "> 250+ problems solved on LeetCode.",
    "> Currently: MCA @ NIET · shipping in public.",
  ]);

  // Content
  new ProjectCarousel();
  new ContribGrid("contribGrid");

  // Forms & interactions
  const formEl = document.querySelector(".form");
  if (formEl) new ContactForm(formEl);
  new ResumeButton("downloadResume");
});

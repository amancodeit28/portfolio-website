import React, { useState, useEffect, useRef } from 'react';
import './index.css';

// Typewriter Component
function Typewriter({ phrases }) {
  const [text, setText] = useState("");

  useEffect(() => {
    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;
    let timeoutId;

    const tick = () => {
      const current = phrases[phraseIndex];

      if (!deleting) {
        setText(current.slice(0, charIndex));
        charIndex++;

        if (charIndex > current.length) {
          deleting = true;
          timeoutId = setTimeout(tick, 2200); // PAUSE_BEFORE_DELETE
        } else {
          timeoutId = setTimeout(tick, 40); // TYPE_SPEED
        }
      } else {
        setText(current.slice(0, charIndex));
        charIndex--;

        if (charIndex < 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          timeoutId = setTimeout(tick, 200); // PAUSE_BEFORE_TYPE
        } else {
          timeoutId = setTimeout(tick, 20); // DELETE_SPEED
        }
      }
    };

    // Initial delay
    timeoutId = setTimeout(tick, 1200);

    return () => clearTimeout(timeoutId);
  }, [phrases]);

  return (
    <div className="hero__typed" id="typed">
      {text}
      <span className="caret"></span>
    </div>
  );
}

// ParticleField Component
function ParticleField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    let particles = [];
    let animationFrameId;

    const LINK_DISTANCE = 140;
    const MAX_PARTICLES = 80;
    const PARTICLE_DENSITY = 25000;

    let w = 0;
    let h = 0;

    const resize = () => {
      w = canvas.width = canvas.offsetWidth * dpr;
      h = canvas.height = canvas.offsetHeight * dpr;
      createParticles();
    };

    const createParticles = () => {
      const count = Math.min(MAX_PARTICLES, Math.floor((w * h) / PARTICLE_DENSITY));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3 * dpr,
        vy: (Math.random() - 0.5) * 0.3 * dpr,
        r: Math.random() * 1.5 + 0.5,
        o: Math.random() * 0.5 + 0.2,
      }));
    };

    const drawLinks = () => {
      const maxDist = LINK_DISTANCE * dpr;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);

          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.15;
            ctx.strokeStyle = `rgba(200, 255, 46, ${alpha})`;
            ctx.lineWidth = 1 * dpr;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };

    const drawDots = () => {
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        ctx.fillStyle = `rgba(200, 255, 46, ${p.o})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * dpr, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      drawLinks();
      drawDots();
      animationFrameId = requestAnimationFrame(draw);
    };

    resize();
    draw();

    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="hero__canvas" id="particles"></canvas>;
}

// CustomCursor Component
function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let ringPos = { ...mouse };
    let animationFrameId;

    const onMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      dot.style.left = `${mouse.x}px`;
      dot.style.top = `${mouse.y}px`;
    };

    const setHover = (active) => {
      dot.classList.toggle("hover", active);
      ring.classList.toggle("hover", active);
    };

    const onMouseOver = (e) => {
      const hoverTargets = "a, button, input, textarea, .stat-grid__item, .skill-cat, .edu-card, .stat-card, .timeline__item, .carousel__dot";
      const target = e.target.closest(hoverTargets);
      if (target) {
        setHover(true);
      } else {
        setHover(false);
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseover", onMouseOver);

    const animate = () => {
      const lerp = 0.15;
      ringPos.x += (mouse.x - ringPos.x) * lerp;
      ringPos.y += (mouse.y - ringPos.y) * lerp;
      ring.style.left = `${ringPos.x}px`;
      ring.style.top = `${ringPos.y}px`;
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor"></div>
      <div ref={ringRef} className="cursor-ring"></div>
    </>
  );
}

// ScrollProgress Component
function ScrollProgress() {
  const [width, setWidth] = useState("0%");

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      if (docHeight <= 0) {
        setWidth("0%");
        return;
      }
      const pct = (scrollTop / docHeight) * 100;
      setWidth(`${pct}%`);
    };

    window.addEventListener("scroll", updateProgress);
    updateProgress();

    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  return <div className="progress" style={{ width }} id="progress"></div>;
}

// ContribGrid Component
function ContribGrid() {
  const [cells, setCells] = useState([]);

  useEffect(() => {
    const totalCells = 26 * 7; // 26 weeks × 7 days
    const levels = [
      { threshold: 0.85, className: "contrib-grid__cell--l4" },
      { threshold: 0.65, className: "contrib-grid__cell--l3" },
      { threshold: 0.40, className: "contrib-grid__cell--l2" },
      { threshold: 0.20, className: "contrib-grid__cell--l1" },
    ];

    const generatedCells = Array.from({ length: totalCells }, (_, i) => {
      const rand = Math.random();
      const level = levels.find((l) => rand > l.threshold);
      return {
        id: i,
        className: "contrib-grid__cell" + (level ? ` ${level.className}` : ""),
      };
    });

    setCells(generatedCells);
  }, []);

  return (
    <div className="contrib-grid" id="contribGrid">
      {cells.map((cell) => (
        <div key={cell.id} className={cell.className}></div>
      ))}
    </div>
  );
}

// Main App Component
function App() {
  const [currentSlide, setCurrentSlide] = useState(() => {
    return parseInt(localStorage.getItem("as_slide") || "0", 10);
  });

  const totalSlides = 3;

  const goToSlide = (index) => {
    const idx = ((index % totalSlides) + totalSlides) % totalSlides;
    setCurrentSlide(idx);
    localStorage.setItem("as_slide", idx);
  };

  const nextSlide = () => goToSlide(currentSlide + 1);
  const prevSlide = () => goToSlide(currentSlide - 1);

  // Keydown listeners for Carousel
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "ArrowRight") nextSlide();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [currentSlide]);

  // Form State and Handler
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    role: "",
    message: "",
  });
  const [formStatus, setFormStatus] = useState("idle"); // 'idle' | 'sending' | 'success' | 'error'

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    const field = id.replace("form-", "");
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormStatus("sending");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formState),
      });

      if (response.ok) {
        setFormStatus("success");
        setFormState({ name: "", email: "", role: "", message: "" });
        setTimeout(() => {
          setFormStatus("idle");
        }, 3000);
      } else {
        setFormStatus("error");
        setTimeout(() => {
          setFormStatus("idle");
        }, 3000);
      }
    } catch (err) {
      console.error(err);
      setFormStatus("error");
      setTimeout(() => {
        setFormStatus("idle");
      }, 3000);
    }
  };

  // ScrollReveal & Counter Animation logic
  useEffect(() => {
    const CounterAnimator = {
      DURATION: 1600,
      animateDecimal(el) {
        const target = parseFloat(el.dataset.target);
        const decimal = parseInt(el.dataset.decimal || "0", 10);
        const hasPlus = el.innerHTML.includes("+");
        const start = performance.now();

        const tick = (now) => {
          const progress = Math.min(1, (now - start) / CounterAnimator.DURATION);
          const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
          const value = target * eased;
          const display = decimal ? value.toFixed(decimal) : Math.floor(value);
          el.innerHTML = display + (hasPlus ? "<sup>+</sup>" : "");
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      animateInteger(el) {
        const target = parseInt(el.dataset.target, 10);
        const start = performance.now();

        const tick = (now) => {
          const progress = Math.min(1, (now - start) / CounterAnimator.DURATION);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(target * eased);
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
    };

    const observer = new IntersectionObserver(
      (entries) => {
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

          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.15 }
    );

    const timer = setTimeout(() => {
      document.querySelectorAll(".reveal").forEach((el) => {
        observer.observe(el);
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      {/* CUSTOM CURSOR */}
      <CustomCursor />

      {/* SCROLL PROGRESS */}
      <ScrollProgress />

      {/* NAVIGATION */}
      <nav className="nav" role="navigation" aria-label="Main navigation">
        <a href="#" className="nav__logo">
          <span className="nav__logo-dot"></span>
          AS / PORTFOLIO'26
        </a>

        <div className="nav__links">
          <a href="#about" className="nav__link">about</a>
          <a href="#skills" className="nav__link">skills</a>
          <a href="#work" className="nav__link">work</a>
          <a href="#stats" className="nav__link">stats</a>
          <a href="#contact" className="nav__link">contact</a>
        </div>

        <button
          className="nav__cta"
          onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
        >
          let's talk →
        </button>
      </nav>

      {/* HERO */}
      <section className="hero section">
        <ParticleField />
        <div className="hero__grid"></div>

        <div className="corner corner--tl"></div>
        <div className="corner corner--tr"></div>
        <div className="corner corner--bl"></div>
        <div className="corner corner--br"></div>

        <div className="hero__inner">
          <div>
            <div className="hero__tag">
              <span className="hero__tag-live"></span>
              AVAILABLE FOR SDE / DATA ROLES · 2026
            </div>

            <h1 className="hero__heading">
              <span className="line"><span className="word">Aman</span></span>
              <span className="line"><span className="word word--delayed">Sharma<em>.</em></span></span>
            </h1>

            <Typewriter phrases={[
              "> Full-stack developer & data analyst.",
              "> Building REST APIs, ETL pipelines, ML systems.",
              "> Certified in Oracle Cloud AI Foundations.",
              "> 250+ problems solved on LeetCode.",
              "> Currently: MCA @ NIET · shipping in public.",
            ]} />

            <div className="hero__ctas">
              <a className="btn btn--primary" href="#work">
                view work
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
              </a>
              <a className="btn" href="/api/resume" target="_blank" rel="noopener noreferrer">
                download résumé
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3v12m-5-5l5 5 5-5M5 21h14"/></svg>
              </a>
            </div>
          </div>

          <div className="monogram">
            <div className="monogram__ring--outer"></div>
            <div className="monogram__ring"></div>
            <div className="monogram__core">A<span style={{ color: "rgba(0,0,0,.5)" }}>·</span>S</div>
            <div className="monogram__label">DELHI · IST +05:30</div>
          </div>
        </div>

        <div className="hero__scroll-cue">
          <span>SCROLL</span>
          <div className="line"></div>
        </div>
      </section>

      {/* SEPARATOR */}
      <div className="separator">
        <div><span className="accent">●</span> FULL-STACK</div>
        <div><span class="accent">●</span> DATA ANALYTICS</div>
        <div><span class="accent">●</span> ML/AI</div>
        <div><span class="accent">●</span> ORACLE CERTIFIED</div>
        <div><span class="accent">●</span> 250+ LEETCODE</div>
        <div><span class="accent">●</span> DELHI, IN</div>
      </div>

      {/* ABOUT */}
      <section className="section" id="about">
        <div className="section__label reveal">01 / About</div>
        <h2 className="section__title reveal reveal--d1">Engineer who ships <em>and</em> analyzes.</h2>

        <div className="about__grid">
          <div className="about__bio reveal reveal--d2">
            I build things that <em>work</em> and figure out <em>why</em> they work.{" "}
            <span className="muted">Full-stack developer and data analyst</span> with hands-on
            experience shipping REST APIs, ETL pipelines, and interactive dashboards.
            Currently pursuing my <em>MCA</em> to go deeper into distributed systems and
            ML engineering — while turning real-world datasets into decisions that matter.
          </div>

          <div className="stat-grid reveal reveal--d3">
            <div className="stat-grid__item">
              <div className="stat-grid__number" data-target="250">0<sup>+</sup></div>
              <div className="stat-grid__label">LeetCode Solved</div>
            </div>
            <div className="stat-grid__item">
              <div className="stat-grid__number" data-target="8.4" data-decimal="1">0.0</div>
              <div className="stat-grid__label">MCA CGPA</div>
            </div>
            <div className="stat-grid__item">
              <div className="stat-grid__number" data-target="8800">0<sup>+</sup></div>
              <div className="stat-grid__label">Netflix Rows Analyzed</div>
            </div>
            <div className="stat-grid__item">
              <div className="stat-grid__number" data-target="4">0</div>
              <div className="stat-grid__label">Certifications</div>
            </div>
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section className="section" id="skills">
        <div className="section__label reveal">02 / Skills & Stack</div>
        <h2 className="section__title reveal reveal--d1">Tools I <em>reach for</em>.</h2>
      </section>

      {/* Marquee ticker */}
      <div className="skills-marquee">
        <div className="marquee">
          <span className="marquee__chip">Python <span className="marquee__sep">✦</span></span>
          <span className="marquee__chip">React.js <span className="marquee__sep">✦</span></span>
          <span className="marquee__chip">Node.js <span className="marquee__sep">✦</span></span>
          <span className="marquee__chip">Express.js <span className="marquee__sep">✦</span></span>
          <span className="marquee__chip">Flask <span className="marquee__sep">✦</span></span>
          <span className="marquee__chip">MongoDB <span className="marquee__sep">✦</span></span>
          <span className="marquee__chip">MySQL <span className="marquee__sep">✦</span></span>
          <span className="marquee__chip">Pandas <span className="marquee__sep">✦</span></span>
          <span className="marquee__chip">REST APIs <span className="marquee__sep">✦</span></span>
          <span className="marquee__chip">Gemini API <span className="marquee__sep">✦</span></span>
          {/* Duplicated for seamless infinite scroll */}
          <span className="marquee__chip">Python <span className="marquee__sep">✦</span></span>
          <span className="marquee__chip">React.js <span className="marquee__sep">✦</span></span>
          <span className="marquee__chip">Node.js <span className="marquee__sep">✦</span></span>
          <span className="marquee__chip">Express.js <span className="marquee__sep">✦</span></span>
          <span className="marquee__chip">Flask <span className="marquee__sep">✦</span></span>
          <span className="marquee__chip">MongoDB <span className="marquee__sep">✦</span></span>
          <span className="marquee__chip">MySQL <span className="marquee__sep">✦</span></span>
          <span className="marquee__chip">Pandas <span className="marquee__sep">✦</span></span>
          <span className="marquee__chip">REST APIs <span className="marquee__sep">✦</span></span>
          <span className="marquee__chip">Gemini API <span className="marquee__sep">✦</span></span>
        </div>
      </div>

      {/* Skill categories */}
      <section className="section">
        <div className="skills__categories">
          <div className="skill-cat reveal">
            <div className="skill-cat__name">Languages</div>
            <div className="skill-cat__list">
              <span className="skill-cat__tag">Python</span>
              <span className="skill-cat__tag">JavaScript</span>
              <span className="skill-cat__tag">HTML5</span>
              <span className="skill-cat__tag">CSS3</span>
              <span className="skill-cat__tag">SQL</span>
            </div>
          </div>

          <div className="skill-cat reveal reveal--d1">
            <div className="skill-cat__name">Frameworks & Libraries</div>
            <div className="skill-cat__list">
              <span className="skill-cat__tag">React</span>
              <span className="skill-cat__tag">Node.js</span>
              <span className="skill-cat__tag">Express.js</span>
              <span className="skill-cat__tag">Flask</span>
              <span className="skill-cat__tag">REST APIs</span>
              <span className="skill-cat__tag">Pandas</span>
              <span className="skill-cat__tag">NumPy</span>
              <span className="skill-cat__tag">Matplotlib</span>
              <span className="skill-cat__tag">Seaborn</span>
              <span className="skill-cat__tag">Plotly</span>
            </div>
          </div>

          <div className="skill-cat reveal reveal--d2">
            <div className="skill-cat__name">Data & Databases</div>
            <div className="skill-cat__list">
              <span className="skill-cat__tag">MySQL</span>
              <span className="skill-cat__tag">MongoDB</span>
              <span className="skill-cat__tag">ETL</span>
              <span className="skill-cat__tag">EDA</span>
              <span className="skill-cat__tag">Tableau</span>
            </div>
          </div>

          <div className="skill-cat reveal reveal--d3">
            <div className="skill-cat__name">CS Foundations</div>
            <div className="skill-cat__list">
              <span className="skill-cat__tag">DSA</span>
              <span className="skill-cat__tag">OOP</span>
              <span className="skill-cat__tag">System Design</span>
              <span className="skill-cat__tag">Git</span>
              <span className="skill-cat__tag">Linux</span>
            </div>
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section className="section" id="work">
        <div className="section__label reveal">03 / Selected Work</div>
        <h2 className="section__title reveal reveal--d1">Three projects, <em>zero</em> filler.</h2>

        <div className="carousel reveal reveal--d2">
          <div className="carousel__track">
            <div className="carousel__slides" id="slides" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>

              {/* SLIDE 1: Thumblify */}
              <div className="slide">
                <div className="slide__visual">
                  <div className="browser">
                    <div className="browser__bar">
                      <span className="browser__dot"></span>
                      <span className="browser__dot"></span>
                      <span className="browser__dot"></span>
                      <div className="browser__url">thumblify-client-two.vercel.app</div>
                    </div>
                    <div className="browser__content">
                      <div className="viz-thumblify">
                        <div className="viz-thumblify__thumb">HOOK</div>
                        <div className="viz-thumblify__thumb">CTR+</div>
                        <div className="viz-thumblify__thumb">AI GEN</div>
                        <div className="viz-thumblify__thumb">16:9</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="slide__content">
                  <div className="project__number">// 01 · MERN + Gemini API <span className="project__year">2026</span></div>
                  <h3 className="project__title">Thumblify</h3>
                  <div className="project__tagline">AI YouTube thumbnail generator</div>
                  <p className="project__desc">Full-stack MERN app that generates and optimizes high-CTR YouTube thumbnails using Google Gemini API, with a real-time preview studio and secure media hosting.</p>
                  <ul className="project__highlights">
                    <li>Interactive React studio with 16:9, 1:1, 9:16 aspect ratio configs and live YouTube-feed simulation</li>
                    <li>Serverless backend with JWT authentication and Cloudinary media caching</li>
                    <li>Deployed on Vercel with CI-friendly build pipeline</li>
                  </ul>
                  <div className="project__tech">
                    <span className="project__tech-tag">React</span>
                    <span className="project__tech-tag">Node.js</span>
                    <span className="project__tech-tag">Express</span>
                    <span className="project__tech-tag">MongoDB</span>
                    <span className="project__tech-tag">Gemini API</span>
                    <span className="project__tech-tag">Cloudinary</span>
                    <span className="project__tech-tag">JWT</span>
                  </div>
                  <div className="project__links">
                    <a className="btn btn--primary" href="https://thumblify-client-two.vercel.app" target="_blank" rel="noopener noreferrer">
                      live demo
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17L17 7M7 7h10v10"/></svg>
                    </a>
                    <a className="btn" href="https://github.com/amancodeit28" target="_blank" rel="noopener noreferrer">
                      github
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
                    </a>
                  </div>
                </div>
              </div>

              {/* SLIDE 2: Netflix EDA */}
              <div className="slide">
                <div className="slide__visual">
                  <div className="browser">
                    <div className="browser__bar">
                      <span className="browser__dot"></span>
                      <span className="browser__dot"></span>
                      <span className="browser__dot"></span>
                      <div className="browser__url">jupyter · netflix_eda.ipynb</div>
                    </div>
                    <div className="browser__content">
                      <div className="viz-netflix">
                        <div className="viz-netflix__bar"></div>
                        <div className="viz-netflix__bar"></div>
                        <div className="viz-netflix__bar"></div>
                        <div className="viz-netflix__bar"></div>
                        <div className="viz-netflix__bar"></div>
                        <div className="viz-netflix__bar"></div>
                        <div className="viz-netflix__bar"></div>
                        <div className="viz-netflix__bar"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="slide__content">
                  <div className="project__number">// 02 · Python EDA <span className="project__year">2024</span></div>
                  <h3 className="project__title">Netflix Data Viz</h3>
                  <div className="project__tagline">Content strategy through 8,800+ titles</div>
                  <p className="project__desc">Deep EDA on Netflix's global catalog. Identified content distribution patterns across 25+ genres and 90+ countries through structured Python pipelines.</p>
                  <ul className="project__highlights">
                    <li>Multi-layer Matplotlib visualizations surfacing genre trends and release seasonality</li>
                    <li>Automated Python pipelines for cleaning, transformation, and aggregation</li>
                    <li>Insights on rating distributions driving content strategy conclusions</li>
                  </ul>
                  <div className="project__tech">
                    <span className="project__tech-tag">Python</span>
                    <span className="project__tech-tag">Pandas</span>
                    <span className="project__tech-tag">NumPy</span>
                    <span className="project__tech-tag">Matplotlib</span>
                    <span className="project__tech-tag">Jupyter</span>
                  </div>
                  <div className="project__links">
                    <a className="btn" href="https://github.com/amancodeit28" target="_blank" rel="noopener noreferrer">
                      view on github
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
                    </a>
                  </div>
                </div>
              </div>

              {/* SLIDE 3: Marketing Funnel */}
              <div className="slide">
                <div className="slide__visual">
                  <div className="browser">
                    <div className="browser__bar">
                      <span className="browser__dot"></span>
                      <span className="browser__dot"></span>
                      <span className="browser__dot"></span>
                      <div className="browser__url">plotly · marketing_funnel.py</div>
                    </div>
                    <div className="browser__content">
                      <div className="viz-funnel">
                        <div className="viz-funnel__stage"><span>AWARENESS</span><span>100%</span></div>
                        <div className="viz-funnel__stage"><span>INTEREST</span><span>75%</span></div>
                        <div className="viz-funnel__stage"><span>DESIRE</span><span>45%</span></div>
                        <div className="viz-funnel__stage"><span>CONVERT</span><span>19.4%</span></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="slide__content">
                  <div className="project__number">// 03 · Analytics + Plotly <span className="project__year">2025</span></div>
                  <h3 className="project__title">Marketing Funnel Analysis</h3>
                  <div className="project__tagline">19.4% conversion, 48.9% checkout drop-off</div>
                  <p className="project__desc">Modeled a 4-stage marketing funnel across simulated e-commerce data, revealing key drop-off points and actionable business signals.</p>
                  <ul className="project__highlights">
                    <li>End-to-end data cleaning, transformation, and stage aggregation with Pandas</li>
                    <li>Interactive drop-off visualizations built in Plotly and Seaborn</li>
                    <li>Surface-level insights turned into concrete retention hypotheses</li>
                  </ul>
                  <div className="project__tech">
                    <span className="project__tech-tag">Python</span>
                    <span className="project__tech-tag">Pandas</span>
                    <span className="project__tech-tag">NumPy</span>
                    <span className="project__tech-tag">Matplotlib</span>
                    <span className="project__tech-tag">Seaborn</span>
                    <span className="project__tech-tag">Plotly</span>
                  </div>
                  <div className="project__links">
                    <a className="btn" href="https://github.com/amancodeit28" target="_blank" rel="noopener noreferrer">
                      view on github
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
                    </a>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Carousel controls */}
          <div className="carousel__controls">
            <div className="carousel__dots" id="dots">
              <button className={`carousel__dot ${currentSlide === 0 ? 'active' : ''}`} onClick={() => goToSlide(0)} aria-label="Go to slide 1"></button>
              <button className={`carousel__dot ${currentSlide === 1 ? 'active' : ''}`} onClick={() => goToSlide(1)} aria-label="Go to slide 2"></button>
              <button className={`carousel__dot ${currentSlide === 2 ? 'active' : ''}`} onClick={() => goToSlide(2)} aria-label="Go to slide 3"></button>
            </div>
            <div className="carousel__arrows">
              <button className="carousel__arrow" id="prev" onClick={prevSlide} aria-label="Previous project">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              </button>
              <button className="carousel__arrow" id="next" onClick={nextSlide} aria-label="Next project">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="section" id="stats">
        <div className="section__label reveal">04 / Numbers</div>
        <h2 className="section__title reveal reveal--d1">Consistency, <em>quantified</em>.</h2>

        <div className="stats__grid">
          {/* LeetCode card */}
          <div className="stat-card reveal reveal--d1">
            <div className="stat-card__icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            </div>
            <div className="stat-card__heading">LeetCode · @lookatthis_28</div>
            <div className="stat-card__big"><span className="counter" data-target="250">0</span><span className="accent">+</span></div>
            <div className="stat-card__sub">Problems solved across DSA topics — arrays, DP, graphs, trees, and system-design patterns.</div>

            <div className="lc-breakdown">
              <div className="lc-item lc-item--easy">
                <span className="lc-item__name">Easy</span>
                <div className="lc-item__bar"><span className="lc-item__fill" data-w="90"></span></div>
                <span className="lc-item__count">62</span>
              </div>
              <div className="lc-item lc-item--med">
                <span className="lc-item__name">Medium</span>
                <div className="lc-item__bar"><span className="lc-item__fill" data-w="75"></span></div>
                <span className="lc-item__count">74</span>
              </div>
              <div className="lc-item lc-item--hard">
                <span className="lc-item__name">Hard</span>
                <div className="lc-item__bar"><span className="lc-item__fill" data-w="18"></span></div>
                <span className="lc-item__count">14</span>
              </div>
            </div>
          </div>

          {/* GitHub card */}
          <div className="stat-card reveal reveal--d2">
            <div className="stat-card__icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
            </div>
            <div className="stat-card__heading">GitHub · @amancodeit28</div>
            <div className="stat-card__big" style={{ color: 'var(--lime)', fontSize: '56px', fontWeight: '600', letterSpacing: '-0.02em' }}>Active</div>
            <div className="stat-card__sub">Contributions over the last 6 months — consistent commits across full-stack + analytics work.</div>
            
            {/* Added contribution grid dynamically here */}
            <ContribGrid />

            <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--line)', fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--muted)', lineHeight: '1.6' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>PUBLIC REPOS</span>
                <span style={{ color: 'var(--lime)' }}>10+</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>TOP LANGUAGES</span>
                <span style={{ color: 'var(--lime)' }}>JS, Python, SQL</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>ACTIVITY</span>
                <span style={{ color: 'var(--lime)' }}>Daily commits</span>
              </div>
            </div>
          </div>

          {/* Academic card */}
          <div className="stat-card reveal reveal--d3">
            <div className="stat-card__icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            </div>
            <div className="stat-card__heading">Academic performance</div>

            <div style={{ display: 'flex', gap: '24px', alignItems: 'center', marginTop: '12px' }}>
              <div className="ring">
                <svg width="120" height="120" viewBox="0 0 120 120">
                  <circle className="ring__track" cx="60" cy="60" r="52" />
                  <circle className="ring__fill" cx="60" cy="60" r="52"
                    strokeDasharray="326.7"
                    strokeDashoffset="52.8"
                    id="cgpaRing" />
                </svg>
                <div className="ring__number">8.4</div>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--muted)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: '8px' }}>Current MCA</div>
                <div style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: '1.5' }}>Top decile in DSA & Systems coursework. Pursuing depth in distributed systems + ML.</div>
              </div>
            </div>

            <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--line)', fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--muted)', letterSpacing: '.1em', textTransform: 'uppercase' }}>
              Prev: BCA · 8.01 CGPA <span style={{ color: 'var(--lime)' }}>↑</span>
            </div>
          </div>
        </div>
      </section>

      {/* TIMELINE / CERTIFICATIONS */}
      <section className="section" id="experience">
        <div className="section__label reveal">05 / Milestones</div>
        <h2 className="section__title reveal reveal--d1">Certifications & <em>signals</em>.</h2>

        <div className="timeline">
          <div className="timeline__item reveal">
            <div className="timeline__date">March 2026 · Current</div>
            <div className="timeline__title">Data Analytics Job Simulation</div>
            <div className="timeline__org">Deloitte Australia · Forage</div>
            <div className="timeline__desc">Completed forensic-technology + data-analysis simulation. Built a Tableau dashboard presenting analytical findings and used Excel for data classification and drawing business conclusions.</div>
          </div>

          <div className="timeline__item reveal reveal--d1">
            <div className="timeline__date">March 2026</div>
            <div className="timeline__title">SQL (Intermediate)</div>
            <div className="timeline__org">HackerRank</div>
            <div className="timeline__desc">Proficiency across joins, subqueries, aggregations, filtering, and window functions through HackerRank's Intermediate-level assessment.</div>
          </div>

          <div className="timeline__item reveal reveal--d2">
            <div className="timeline__date">2025</div>
            <div className="timeline__title">OCI 2025 AI Foundations Associate</div>
            <div className="timeline__org">Oracle Cloud Infrastructure</div>
            <div className="timeline__desc">Foundational knowledge of AI, Machine Learning, computer vision, and generative AI as delivered on Oracle Cloud Infrastructure.</div>
          </div>

          <div className="timeline__item reveal reveal--d3">
            <div className="timeline__date">2024</div>
            <div className="timeline__title">Case Studies on Seaborn</div>
            <div className="timeline__org">Infosys Springboard</div>
            <div className="timeline__desc">Performed EDA using Seaborn for statistical data visualization; analyzed patterns, trends, and relationships across datasets.</div>
          </div>
        </div>
      </section>

      {/* EDUCATION */}
      <section className="section" id="education">
        <div className="section__label reveal">06 / Education</div>
        <h2 className="section__title reveal reveal--d1">Where I'm <em>learning</em>.</h2>

        <div className="edu__grid">
          <div className="edu-card reveal reveal--d1">
            <div className="edu-card__degree">Master of Computer Applications</div>
            <div className="edu-card__school">Noida Institute of Engineering and Technology</div>
            <div className="edu-card__location">NIET · Greater Noida, UP · 2025 – 2027</div>
            <div className="edu-card__stats">
              <div><span className="edu-card__stats-key">CGPA</span><span className="edu-card__stats-val">8.4</span></div>
              <div><span className="edu-card__stats-key">Focus</span><span className="edu-card__stats-val edu-card__stats-val--sm">Distributed Systems + ML</span></div>
              <div><span className="edu-card__stats-key">Status</span><span className="edu-card__stats-val edu-card__stats-val--sm">In progress</span></div>
            </div>
          </div>

          <div className="edu-card reveal reveal--d2">
            <div className="edu-card__degree">Bachelor of Computer Applications</div>
            <div className="edu-card__school">Galgotias University</div>
            <div className="edu-card__location">Greater Noida, UP · 2022 – 2025</div>
            <div className="edu-card__stats">
              <div><span className="edu-card__stats-key">CGPA</span><span className="edu-card__stats-val">8.01</span></div>
              <div><span className="edu-card__stats-key">Focus</span><span className="edu-card__stats-val edu-card__stats-val--sm">DSA + Web Dev</span></div>
              <div><span className="edu-card__stats-key">Status</span><span className="edu-card__stats-val edu-card__stats-val--sm">Graduated</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="contact section" id="contact">
        <div className="contact__inner">
          <div>
            <div className="section__label reveal">07 / Contact</div>
            <h2 className="section__title reveal reveal--d1">Let's <em>build</em> something.</h2>
            <p className="contact__lead reveal reveal--d2">Actively looking for Software Developer and Data Analyst / Analytics-Engineering roles for 2026-27. If you're hiring for SDE or analyst positions — my inbox is open.</p>

            <div className="contact__links reveal reveal--d3">
              <a href="mailto:sharmaaman8657@gmail.com" className="contact__link">
                <div><span className="dim">01 —</span> Email</div>
                <span>sharmaaman8657@gmail.com <span className="contact__link-icon">↗</span></span>
              </a>
              <a href="tel:+917683050771" className="contact__link">
                <div><span className="dim">02 —</span> Phone</div>
                <span>+91 76830 50771 <span className="contact__link-icon">↗</span></span>
              </a>
              <a href="https://linkedin.com/in/aman-sharma2821" target="_blank" rel="noopener noreferrer" className="contact__link">
                <div><span className="dim">03 —</span> LinkedIn</div>
                <span>/in/aman-sharma2821 <span className="contact__link-icon">↗</span></span>
              </a>
              <a href="https://github.com/amancodeit28" target="_blank" rel="noopener noreferrer" className="contact__link">
                <div><span className="dim">04 —</span> GitHub</div>
                <span>@amancodeit28 <span className="contact__link-icon">↗</span></span>
              </a>
              <a href="https://leetcode.com/u/lookatthis_28/" target="_blank" rel="noopener noreferrer" class="contact__link">
                <div><span className="dim">05 —</span> LeetCode</div>
                <span>@lookatthis_28 <span className="contact__link-icon">↗</span></span>
              </a>
            </div>
          </div>

          <form className="form reveal reveal--d3" onSubmit={handleFormSubmit}>
            <div className="form__group">
              <label className="form__label" htmlFor="form-name">Your name</label>
              <input
                className="form__input"
                id="form-name"
                type="text"
                placeholder="Alex from Google Recruiting"
                value={formState.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form__group">
              <label className="form__label" htmlFor="form-email">Email</label>
              <input
                className="form__input"
                id="form-email"
                type="email"
                placeholder="alex@company.com"
                value={formState.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form__group">
              <label className="form__label" htmlFor="form-role">Company / role</label>
              <input
                className="form__input"
                id="form-role"
                type="text"
                placeholder="e.g. SWE Intern, New Grad SDE"
                value={formState.role}
                onChange={handleInputChange}
              />
            </div>
            <div className="form__group">
              <label className="form__label" htmlFor="form-message">Message</label>
              <textarea
                className="form__textarea"
                id="form-message"
                placeholder="Tell me about the opportunity…"
                value={formState.message}
                onChange={handleInputChange}
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="form__submit"
              disabled={formStatus === 'sending'}
              style={formStatus === 'success' ? { background: 'var(--cyan)' } : {}}
            >
              {formStatus === 'success'
                ? "✓ sent — I'll reply within 24h"
                : formStatus === 'sending'
                  ? "sending..."
                  : "send message"
              }
              {formStatus !== 'success' && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
              )}
            </button>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer__inner">
          <div>© 2026 · AMAN SHARMA · CRAFTED IN DELHI</div>
          <div className="footer__socials">
            <a href="https://linkedin.com/in/aman-sharma2821" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href="https://github.com/amancodeit28" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="https://leetcode.com/u/lookatthis_28/" target="_blank" rel="noopener noreferrer">LeetCode</a>
            <a href="mailto:sharmaaman8657@gmail.com">Email</a>
          </div>
          <div>v1.0 · <span style={{ color: 'var(--lime)' }}>●</span> ONLINE</div>
        </div>
      </footer>
    </>
  );
}

export default App;

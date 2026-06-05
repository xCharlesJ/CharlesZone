import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import logoUrl from "../assets/logo.png";
import heroVisualUrl from "../assets/charles-avatar-transparent.png";
import ClickSpark from "./components/ClickSpark.jsx";

const navItems = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#experience", label: "Work" },
  { href: "#contact", label: "Contact" }
];

const workCards = [
  {
    title: "AI Workflow Assistant",
    label: "AI Product",
    modifier: "assistant",
    description:
      "A practical assistant concept for summarizing documents, routing tasks, and helping teams move from scattered context to clear action.",
    tags: ["LLM", "Automation", "UX", "PRD"]
  },
  {
    title: "Analytics Decision Dashboard",
    label: "Data Product",
    modifier: "dashboard",
    description:
      "A metrics workspace for tracking product signals, comparing trends, and turning noisy operating data into better prioritization.",
    tags: ["Dashboard", "Metrics", "Insights"]
  },
  {
    title: "Charles Zone Resume Site",
    label: "Portfolio",
    modifier: "portfolio",
    description:
      "A dark interactive portfolio system that presents product thinking, AI focus, resume details, and contact paths in one polished flow.",
    tags: ["React", "Vite", "Cloudflare"]
  }
];

function Loader() {
  const [progress, setProgress] = useState(0);
  const [hidden, setHidden] = useState(false);
  const statuses = useMemo(
    () => [
      "Initializing profile...",
      "Mapping product instincts...",
      "Loading AI projects...",
      "Ready for launch."
    ],
    []
  );

  useEffect(() => {
    const finish = () => {
      setProgress(100);
      window.setTimeout(() => setHidden(true), 260);
    };
    const timer = window.setInterval(() => {
      setProgress((current) => {
        const next = Math.min(100, current + Math.ceil(Math.random() * 11));
        if (next >= 100) {
          window.clearInterval(timer);
          finish();
        }
        return next;
      });
    }, 80);
    const failsafe = window.setTimeout(() => {
      window.clearInterval(timer);
      finish();
    }, 2200);

    return () => {
      window.clearInterval(timer);
      window.clearTimeout(failsafe);
    };
  }, []);

  const status = statuses[Math.min(statuses.length - 1, Math.floor(progress / 30))];

  return (
    <div className={`loader${hidden ? " is-hidden" : ""}`} data-loader>
      <p className="loader__percent">{progress}%</p>
      <p className="loader__status">{progress >= 100 ? statuses[3] : status}</p>
    </div>
  );
}

function ConstellationCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d");
    let width = 0;
    let height = 0;
    let particles = [];
    let animationFrame = 0;

    function resizeCanvas() {
      width = canvas.width = window.innerWidth * window.devicePixelRatio;
      height = canvas.height = window.innerHeight * window.devicePixelRatio;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      particles = Array.from({ length: Math.min(90, Math.floor(window.innerWidth / 16)) }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.28 * window.devicePixelRatio,
        vy: (Math.random() - 0.5) * 0.28 * window.devicePixelRatio,
        r: (Math.random() * 1.6 + 0.6) * window.devicePixelRatio
      }));
    }

    function animateCanvas() {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "rgba(247, 249, 252, 0.46)";
      ctx.strokeStyle = "rgba(61, 214, 207, 0.12)";
      ctx.lineWidth = window.devicePixelRatio;

      particles.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > height) particle.vy *= -1;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
        ctx.fill();

        for (let next = index + 1; next < particles.length; next += 1) {
          const other = particles[next];
          const distance = Math.hypot(particle.x - other.x, particle.y - other.y);
          if (distance < 130 * window.devicePixelRatio) {
            ctx.globalAlpha = 1 - distance / (130 * window.devicePixelRatio);
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      });

      animationFrame = window.requestAnimationFrame(animateCanvas);
    }

    resizeCanvas();
    animateCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return <canvas className="constellation" ref={canvasRef} aria-hidden="true" />;
}

function CustomCursor() {
  const dotRef = useRef(null);

  useEffect(() => {
    const cursorDot = dotRef.current;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!cursorDot || !finePointer.matches || reducedMotion.matches) return undefined;

    const cursor = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const moveCursorDot = () => {
      cursorDot.style.left = `${cursor.x}px`;
      cursorDot.style.top = `${cursor.y}px`;
    };
    const handlePointerMove = (event) => {
      cursor.x = event.clientX;
      cursor.y = event.clientY;
      cursorDot.classList.add("is-visible");
      moveCursorDot();
    };
    const handlePointerDown = () => {
      cursorDot.classList.add("is-pressed");
    };
    const handlePointerUp = () => cursorDot.classList.remove("is-pressed");
    const handleLeave = () => cursorDot.classList.remove("is-visible");

    moveCursorDot();
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointerup", handlePointerUp);
    document.documentElement.addEventListener("mouseleave", handleLeave);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      document.documentElement.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  return <div className="cursor-dot" ref={dotRef} aria-hidden="true" />;
}

function ThemeDock() {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setThemeState] = useState(() =>
    document.documentElement.dataset.theme === "light" ? "light" : "dark"
  );
  const dockRef = useRef(null);

  const setTheme = (nextTheme) => {
    const normalizedTheme = nextTheme === "light" ? "light" : "dark";
    if (normalizedTheme === "light") {
      document.documentElement.dataset.theme = "light";
    } else {
      delete document.documentElement.dataset.theme;
    }
    setThemeState(normalizedTheme);
    try {
      window.localStorage.setItem("charles-theme", normalizedTheme);
    } catch {
      // Storage can fail in private browsing or locked-down environments.
    }
  };

  useEffect(() => {
    setTheme(theme);
    const handleClick = (event) => {
      if (!dockRef.current?.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <aside className={`theme-dock${isOpen ? " is-open" : ""}`} ref={dockRef} aria-label="Theme settings">
      <button
        className="theme-dock__toggle"
        type="button"
        aria-expanded={isOpen}
        aria-label="Open theme settings"
        onClick={() => setIsOpen((current) => !current)}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M19.43 12.98c.04-.32.07-.65.07-.98s-.02-.66-.07-.98l2.11-1.65a.5.5 0 0 0 .12-.64l-2-3.46a.5.5 0 0 0-.61-.22l-2.49 1a7.28 7.28 0 0 0-1.69-.98L14.5 2.4A.5.5 0 0 0 14 2h-4a.5.5 0 0 0-.5.4l-.38 2.67c-.61.24-1.18.57-1.69.98l-2.49-1a.5.5 0 0 0-.61.22l-2 3.46a.5.5 0 0 0 .12.64l2.11 1.65c-.04.32-.06.65-.06.98s.02.66.06.98l-2.11 1.65a.5.5 0 0 0-.12.64l2 3.46c.13.23.4.32.61.22l2.49-1c.51.4 1.08.73 1.69.98l.38 2.67c.04.23.24.4.5.4h4c.26 0 .46-.17.5-.4l.38-2.67c.61-.25 1.18-.58 1.69-.98l2.49 1c.22.1.49.01.61-.22l2-3.46a.5.5 0 0 0-.12-.64l-2.11-1.65ZM12 15.5A3.5 3.5 0 1 1 12 8a3.5 3.5 0 0 1 0 7.5Z" />
        </svg>
      </button>
      <div className="theme-dock__panel">
        <p>Theme</p>
        <div className="theme-dock__choices" role="group" aria-label="Color theme">
          {["dark", "light"].map((choice) => (
            <button
              key={choice}
              type="button"
              aria-pressed={theme === choice}
              onClick={() => {
                setTheme(choice);
                setIsOpen(false);
              }}
            >
              {choice === "dark" ? "Dark" : "Light"}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAtTop, setIsAtTop] = useState(() => window.scrollY < 36);
  const [activeHref, setActiveHref] = useState("#home");
  const [hoverHref, setHoverHref] = useState(null);
  const [liquidStyle, setLiquidStyle] = useState({});
  const navRef = useRef(null);
  const headerRef = useRef(null);
  const linkRefs = useRef({});

  const targetHref = hoverHref || activeHref;

  const moveLiquidTo = () => {
    const nav = navRef.current;
    const link = linkRefs.current[targetHref];
    if (!nav || !link) return;
    const navRect = nav.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    setLiquidStyle({
      "--liquid-x": `${linkRect.left - navRect.left}px`,
      "--liquid-y": `${linkRect.top - navRect.top}px`,
      "--liquid-w": `${linkRect.width}px`,
      "--liquid-h": `${linkRect.height}px`,
      "--liquid-scale": hoverHref ? "1.04" : "1"
    });
    headerRef.current?.style.setProperty("--glow-x", `${linkRect.left + linkRect.width / 2}px`);
  };

  useLayoutEffect(() => {
    moveLiquidTo();
  }, [targetHref, isAtTop]);

  useEffect(() => {
    const handleScroll = () => setIsAtTop(window.scrollY < 36);
    const handleResize = () => moveLiquidTo();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [targetHref]);

  useEffect(() => {
    const sectionNodes = [...document.querySelectorAll("main section[id]")];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveHref(`#${entry.target.id}`);
        });
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    sectionNodes.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleKeydown = (event) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };
    const handleClick = (event) => {
      if (headerRef.current?.contains(event.target)) return;
      setIsMenuOpen(false);
    };
    document.addEventListener("keydown", handleKeydown);
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("keydown", handleKeydown);
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <header
      className={`site-header${isMenuOpen ? " is-menu-open" : ""}${isAtTop ? " is-at-top" : " is-scrolled"}`}
      ref={headerRef}
    >
      <a className="brand" href="#home" aria-label="Charles Ji home">
        <img src={logoUrl} alt="" />
      </a>
      <a className="brand-name" href="#home">
        Charles <span>Zone</span>
      </a>
      <button
        className="nav-toggle"
        type="button"
        aria-label="Open menu"
        aria-expanded={isMenuOpen}
        onClick={() => setIsMenuOpen((current) => !current)}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
      <nav className="nav" aria-label="Primary" ref={navRef} style={liquidStyle}>
        <span className="nav__liquid" aria-hidden="true"></span>
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            ref={(node) => {
              linkRefs.current[item.href] = node;
            }}
            className={activeHref === item.href ? "is-active" : ""}
            onMouseEnter={() => setHoverHref(item.href)}
            onMouseLeave={() => setHoverHref(null)}
            onFocus={() => setHoverHref(item.href)}
            onBlur={() => setHoverHref(null)}
            onClick={() => setIsMenuOpen(false)}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}

function Hero() {
  const role = "AI Product Manager";
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const delay = !deleting && charIndex === role.length ? 5000 : deleting ? 35 : 70;
    const timer = window.setTimeout(() => {
      if (!deleting && charIndex < role.length) {
        setCharIndex((current) => current + 1);
      } else if (!deleting) {
        setDeleting(true);
      } else if (charIndex > 0) {
        setCharIndex((current) => current - 1);
      } else {
        setDeleting(false);
        setCharIndex(1);
      }
    }, delay);

    return () => window.clearTimeout(timer);
  }, [charIndex, deleting]);

  return (
    <section className="hero" id="home">
      <div className="hero__copy">
        <p className="eyebrow">Portfolio / Resume</p>
        <h1>Charles Ji</h1>
        <h2>
          <span>{role.slice(0, charIndex)}</span>
          <span className="caret">█</span>
        </h2>
        <p>
          用 AI 技术解决真实问题，用建筑级思维打造可靠、易用的产品 | Use AI technology to solve real
          problems, and build reliable, easy-to-use products with architectural-level thinking.
        </p>
        <div className="hero__actions">
          <a className="button button--primary" href="#experience">
            View work
          </a>
          <a className="button button--ghost" href="#contact">
            Contact
          </a>
        </div>
      </div>
      <figure className="hero__visual">
        <img src={heroVisualUrl} alt="Illustrated portrait of Charles Ji" />
      </figure>
    </section>
  );
}

function About() {
  return (
    <section className="section about-section" id="about">
      <div className="section__intro">
        <p className="eyebrow">About</p>
        <h2>About Me</h2>
        <p>Get to know the person behind the product thinking.</p>
      </div>

      <div className="about-layout">
        <div className="about-profile">
          <div className="about-copy">
            <p>
              I'm Charles Ji, an AI Product Manager focused on turning ambiguous problems into useful,
              reliable product experiences. I care about practical AI: workflows that reduce friction,
              interfaces people can understand, and systems that hold up beyond a prototype demo.
            </p>
            <p>
              My background in architecture shaped how I think about products: structure first, experience
              always, and every detail connected to how people actually move through a space or a workflow.
              I bring that architectural-level thinking into AI products, from problem framing and requirement
              design to delivery and iteration.
            </p>
            <p>
              I'm especially interested in AI assistants, automation tools, knowledge workflows, and products
              that make complex tasks feel clear, trustworthy, and easy to use.
            </p>
          </div>

          <div className="about-highlights" aria-label="Profile highlights">
            {[
              ["AI", "AI Product Strategy"],
              ["UX", "Human-Centered Workflows"],
              ["AR", "Architecture Background"],
              ["PM", "Problem to Product Delivery"]
            ].map(([code, label]) => (
              <div className="about-highlight" key={code}>
                <span>{code}</span>
                <strong>{label}</strong>
              </div>
            ))}
          </div>

          <div className="about-meta" aria-label="Profile links">
            <a href="https://github.com/" target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            <a href="#" aria-disabled="true">
              Resume
            </a>
          </div>
        </div>

        <div className="about-credentials">
          <div className="about-block">
            <h3>
              <span>01</span> Experience
            </h3>
            <CredentialCard
              title="AI Product Manager"
              subtitle="Charles Zone"
              time="2024 - Present"
              description="Define AI product direction, translate real user problems into workflows, and shape prototypes into reliable product experiences."
              tags={["AI Strategy", "PRD", "Automation", "UX"]}
            />
            <CredentialCard
              title="Architecture / Product Design"
              subtitle="Spatial systems and user experience"
              time="2020 - 2024"
              description="Built a strong foundation in systems thinking, interaction flow, visual hierarchy, and designing for real human behavior."
              tags={["Systems", "Research", "Design"]}
            />
          </div>

          <div className="about-block">
            <h3>
              <span>02</span> Education & Focus
            </h3>
            <CredentialCard compact title="AI Product Management" subtitle="Product strategy, AI workflows, and delivery" time="Now" />
            <CredentialCard compact title="Architecture" subtitle="Structure, spatial thinking, and human experience" time="Foundation" />
          </div>
        </div>
      </div>
    </section>
  );
}

function CredentialCard({ title, subtitle, time, description, tags = [], compact = false }) {
  return (
    <article className={`credential-card${compact ? " credential-card--compact" : ""}`}>
      <div>
        <h4>{title}</h4>
        <p>{subtitle}</p>
      </div>
      <time>{time}</time>
      {description && <p>{description}</p>}
      {tags.length > 0 && (
        <div className="tag-row">
          {tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      )}
    </article>
  );
}

function SelectedWork() {
  return (
    <section className="section" id="experience">
      <p className="eyebrow">Selected Work</p>
      <h2 className="work-title">Products, workflows and systems I've shaped.</h2>
      <div className="work-grid">
        {workCards.map((card) => (
          <article className="work-card reveal" key={card.title}>
            <div className={`work-card__media work-card__media--${card.modifier}`}>
              <span className="work-card__label">{card.label}</span>
              <div className="work-card__actions" aria-hidden="true">
                <span>GH</span>
                <span>UP</span>
              </div>
            </div>
            <div className="work-card__body">
              <h3>{card.title}</h3>
              <p>{card.description}</p>
              <div className="work-tags">
                {card.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Contact() {
  const [visibleInfo, setVisibleInfo] = useState({});
  const toggleInfo = (id) => setVisibleInfo((current) => ({ ...current, [id]: !current[id] }));

  return (
    <section className="section contact-section" id="contact">
      <div className="contact-copy">
        <p className="contact-kicker">
          <span aria-hidden="true">&gt;&gt;&gt;</span> Stay Connected
        </p>
        <h2>Let's Work Together!</h2>
        <div className="contact-list">
          <ContactItem id="phone-info" label="Phone" value="+86 176 2098 8400" href="tel:+8617620988400" visible={visibleInfo["phone-info"]} onToggle={toggleInfo} icon="phone" />
          <ContactItem id="email-info" label="Email" value="xCharles_J@outlook.com" href="mailto:xCharles_J@outlook.com" visible={visibleInfo["email-info"]} onToggle={toggleInfo} icon="email" />
          <ContactItem id="location-info" label="Location" value="GuangDong, China" visible={visibleInfo["location-info"]} onToggle={toggleInfo} icon="location" />
        </div>
      </div>

      <form className="contact-form" action="mailto:xCharles_J@outlook.com" method="post" encType="text/plain">
        <label>
          <span>Full Name</span>
          <input type="text" name="name" placeholder="Full Name" autoComplete="name" required />
        </label>
        <label>
          <span>Email Address</span>
          <input type="email" name="email" placeholder="Email Address" autoComplete="email" required />
        </label>
        <label>
          <span>Phone Number</span>
          <input type="tel" name="phone" placeholder="Phone Number" autoComplete="tel" />
        </label>
        <label>
          <span>Choose Service</span>
          <select name="service" required defaultValue="">
            <option value="">Choose Service</option>
            <option>AI Product Strategy</option>
            <option>Workflow Automation</option>
            <option>Product Discovery</option>
            <option>Portfolio / Resume Website</option>
          </select>
        </label>
        <label className="contact-form__message">
          <span>Write Your Message</span>
          <textarea name="message" placeholder="Write Your Message" required></textarea>
        </label>
        <button className="button button--primary contact-form__submit" type="submit">
          Send Message
        </button>
      </form>
    </section>
  );
}

function ContactItem({ id, icon, label, value, href, visible, onToggle }) {
  const content = href ? <a href={href}>{value}</a> : value;
  return (
    <div className="contact-item">
      <button
        className="contact-item__icon"
        type="button"
        aria-expanded={visible}
        aria-controls={id}
        aria-label={`Show ${label.toLowerCase()}`}
        onClick={() => onToggle(id)}
      >
        <ContactIcon type={icon} />
      </button>
      <span className="contact-item__details" id={id} hidden={!visible}>
        <small>{label}</small>
        <strong>{content}</strong>
      </span>
    </div>
  );
}

function ContactIcon({ type }) {
  const paths = {
    phone:
      "M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.31-.31.76-.41 1.16-.27 1.28.42 2.61.63 3.93.63.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C10.85 21 3 13.15 3 3.5c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.32.21 2.65.63 3.93.14.4.04.85-.27 1.16l-2.24 2.2Z",
    email:
      "M4 5h16c1.1 0 2 .9 2 2v10c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V7c0-1.1.9-2 2-2Zm8 7.25L4.3 7.4 4 7.58V17h16V7.58l-.3-.18L12 12.25Zm0-2.1L18.7 7H5.3L12 10.15Z",
    location:
      "M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z"
  };
  return (
    <svg viewBox="0 0 24 24">
      <path d={paths[type]} />
    </svg>
  );
}

function Footer() {
  return (
    <footer className="footer section">
      <div className="footer__top">
        <div className="footer__brand">
          <strong>
            Charles <span>Zone</span>
          </strong>
          <p>用产品思维创造美好体验</p>
        </div>
        <div className="footer__connect">
          <div className="social-row" aria-label="Social links">
            <SocialLink href="https://github.com/" label="GitHub" path="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.68c-2.78.6-3.37-1.18-3.37-1.18a2.65 2.65 0 0 0-1.11-1.46c-.91-.62.07-.61.07-.61a2.1 2.1 0 0 1 1.53 1.03 2.13 2.13 0 0 0 2.91.83 2.12 2.12 0 0 1 .63-1.34c-2.22-.25-4.56-1.11-4.56-4.95a3.87 3.87 0 0 1 1.03-2.69 3.6 3.6 0 0 1 .1-2.65s.84-.27 2.75 1.03A9.46 9.46 0 0 1 12 6a9.46 9.46 0 0 1 2.5.34c1.91-1.3 2.75-1.03 2.75-1.03.37.86.4 1.82.1 2.65a3.87 3.87 0 0 1 1.03 2.69c0 3.85-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
            <SocialLink href="https://www.linkedin.com/" label="LinkedIn" path="M6.94 8.98H3.7V20h3.24V8.98ZM5.32 4a1.88 1.88 0 1 0 0 3.76 1.88 1.88 0 0 0 0-3.76Zm7.05 4.98H9.26V20h3.24v-5.45c0-1.44.27-2.83 2.05-2.83 1.76 0 1.78 1.64 1.78 2.92V20h3.24v-6.04c0-2.96-.64-5.24-4.1-5.24a3.59 3.59 0 0 0-3.23 1.78h-.04l.17-1.52Z" />
            <SocialLink href="https://www.instagram.com/" label="Instagram" path="M7.75 2h8.5A5.76 5.76 0 0 1 22 7.75v8.5A5.76 5.76 0 0 1 16.25 22h-8.5A5.76 5.76 0 0 1 2 16.25v-8.5A5.76 5.76 0 0 1 7.75 2Zm0 2A3.75 3.75 0 0 0 4 7.75v8.5A3.75 3.75 0 0 0 7.75 20h8.5A3.75 3.75 0 0 0 20 16.25v-8.5A3.75 3.75 0 0 0 16.25 4h-8.5ZM12 7.15A4.85 4.85 0 1 1 12 16.85 4.85 4.85 0 0 1 12 7.15Zm0 2A2.85 2.85 0 1 0 12 14.85 2.85 2.85 0 0 0 12 9.15Zm5.05-2.45a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3Z" />
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <p>2026 Charles Ji. All rights reserved.</p>
      </div>
    </footer>
  );
}

function SocialLink({ href, label, path }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" aria-label={label}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d={path} />
      </svg>
    </a>
  );
}

function RevealObserver() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("is-visible");
        });
      },
      { threshold: 0.22 }
    );
    document.querySelectorAll(".reveal").forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return null;
}

export default function App() {
  return (
    <ClickSpark
      sparkColor="#ffffff"
      sparkSize={10}
      sparkRadius={19}
      sparkCount={12}
      duration={250}
      easing="linear"
      extraScale={1.3}
    >
      <Loader />
      <ConstellationCanvas />
      <CustomCursor />
      <ThemeDock />
      <Header />
      <main>
        <Hero />
        <About />
        <SelectedWork />
        <Contact />
        <Footer />
      </main>
      <RevealObserver />
    </ClickSpark>
  );
}

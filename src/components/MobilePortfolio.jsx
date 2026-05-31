import React, { useState, useEffect } from "react";

/**
 * MobilePortfolio — shown INSTEAD of the 3D MacBook experience on mobile.
 *
 * Design decisions:
 * - Same color palette as the terminal (#00e5a0, #ce93d8, #29b6f6)
 * - Tab-based navigation — no typing required, one thumb reachable
 * - Boot sequence animation preserved — keeps the personality
 * - Cards tap-to-expand for projects — familiar mobile pattern
 * - No keyboard dependency whatsoever
 */

const BOOT_LINES = [
  "[✓] Detecting environment...",
  `[✓] Local timezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}`,
  "[✓] Session initialized",
  "[✓] Mobile interface loaded",
];

const SKILLS = [
  {
    category: "Languages",
    items: ["Python", "JavaScript"],
  },
  {
    category: "Frontend",
    items: ["React.js", "HTML5", "CSS3"],
  },
  {
    category: "Backend",
    items: ["Django", "Express.js"],
  },
  {
    category: "Databases",
    items: ["PostgreSQL", "MySQL"],
  },
  {
    category: "DevOps & Tools",
    items: ["Docker", "Git", "Jenkins"],
  },
];

const PROJECTS = [
  {
    key: "tork-ai",
    title: "Tork AI",
    subtitle: "Multimodal Enterprise Knowledge Platform",
    overview:
      "A multimodal enterprise knowledge platform designed to help organizations efficiently store, search, and retrieve information across text, images, audio, and video. Combines RAG with semantic search to provide context-aware information retrieval through a unified interface.",
    techStack: [
      "React.js",
      "Django",
      "Django REST",
      "PostgreSQL",
      "pgvector",
      "Ollama",
      "MinIO",
      "JWT",
      "Redis",
      "Docker",
    ],
    challenges: [
      {
        title: "Inconsistent Retrieval of Knowledge Chunks",
        problem:
          "Users occasionally received incomplete or irrelevant context during semantic search despite the information being present in the knowledge base.",
        solution:
          "The retrieval logic was placed in the wrong Django application layer. Refactored by relocating it to the correct service layer.",
        result:
          "Retrieval became reliable, consistently returning the most relevant context for downstream LLM processing.",
      },
      {
        title: "Intermittent LLM Response Failures",
        problem:
          "After integrating Ollama, user queries intermittently timed out. The issue was difficult to reproduce.",
        solution:
          "Ollama was not running persistently. Configured it to run as a background service on system startup.",
        result:
          "LLM availability became stable. Timeout failures were eliminated.",
      },
    ],
  },
  {
    key: "bot-detection",
    title: "Human Bot Detection System",
    subtitle: "Multi-Layer Behavioral Verification",
    overview:
      "A multi-layer Human Bot Detection system that distinguishes genuine users from bots without CAPTCHAs. Built a probabilistic pipeline evaluating authenticity through Behavioral Analysis, Network Analysis, Browser Integrity Validation, and Temporal Consistency monitoring.",
    techStack: [
      "React.js",
      "Custom JS SDK",
      "Django",
      "Django REST",
      "PostgreSQL",
      "XGBoost",
      "Random Forest",
      "Scikit-Learn",
      "Cloudflare Pages",
      "Redis",
    ],
    challenges: [
      {
        title: "Reducing False Positives",
        problem:
          "The initial system relied solely on an ML model, leading to a high number of false positives where legitimate users were flagged as bots.",
        solution:
          "Redesigned into a multi-layer framework with Network Analysis, Browser Integrity Validation, and rule-based gating alongside Behavioral Analysis.",
        result:
          "Significantly reduced false positives. Decisions now rely on multiple independent signals instead of a single ML prediction.",
      },
      {
        title: "Balancing Accuracy During Logic Changes",
        problem:
          "Introducing new detection rules often affected overall classification accuracy, causing unexpected regressions.",
        solution:
          "Implemented iterative threshold tuning and continuously monitored classification outcomes after each change.",
        result:
          "Key learning: More signals do not always equal better results. Careful balancing of rules and thresholds is critical.",
      },
    ],
  },
];

const CONTACTS = [
  {
    emoji: "📧",
    label: "Email",
    href: "mailto:parthkhairnar2005@gmail.com",
    display: "parthkhairnar2005@gmail.com",
  },
  {
    emoji: "📂",
    label: "GitHub",
    href: "https://github.com/Parthprogramming",
    display: "github.com/Parthprogramming",
  },
  {
    emoji: "🔗",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/parthkhairnar/",
    display: "linkedin.com/in/parthkhairnar",
  },
  {
    emoji: "📄",
    label: "Resume",
    href: "/Parth_Khairnar_Resume.pdf",
    display: "Download Resume",
  },
];

const INTERNSHIP = {
  company: "Autherity",
  type: "Internship",
  role: "Frontend Developer",
  duration: "Apr 2024 – Feb 2026",
  roleBullets: [
    "Engineered responsive, accessible UI components using React.js, serving internal dashboard users across multiple devices and screen sizes.",
  ],
  project: "Human Bot Detection System",
  projectBullets: [
    "Designed and implemented a 4-layer bot detection engine (Behavioral, Network, Browser, Temporal layers) with site-key/secret-key-based secure verification — achieving a low false-positive rate in adversarial testing.",
    "Validated system robustness against Selenium, Playwright, and Puppeteer stealth automation bots through structured adversarial test campaigns.",
    "Integrated RESTful API endpoints between React.js frontend and backend services, ensuring seamless data flow and secure authentication.",
  ],
};

// ─── Reusable sub-components ────────────────────────────────────────────────

const SectionHeading = ({ children }) => (
  <div
    style={{
      color: "#ce93d8",
      fontSize: "11px",
      textTransform: "uppercase",
      letterSpacing: "1.2px",
      marginBottom: "12px",
      marginTop: "4px",
    }}
  >
    {children}
  </div>
);

const Tag = ({ label }) => (
  <span
    style={{
      display: "inline-block",
      padding: "3px 10px",
      border: "1px solid rgba(255,255,255,0.12)",
      borderRadius: "4px",
      background: "rgba(255,255,255,0.04)",
      color: "rgba(255,255,255,0.65)",
      fontSize: "11px",
      margin: "3px",
    }}
  >
    {label}
  </span>
);

// ─── Tab views ──────────────────────────────────────────────────────────────

const AboutView = () => (
  <div style={{ padding: "20px 16px" }}>
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginBottom: "20px",
      }}
    >
      <img
        src="/about_photo.JPG"
        alt="Parth Khairnar"
        style={{
          width: "90px",
          height: "110px",
          objectFit: "cover",
          borderRadius: "10px",
          border: "2px solid rgba(0,229,160,0.3)",
          marginBottom: "12px",
        }}
      />
      <div
        style={{
          color: "#00e5a0",
          fontSize: "16px",
          fontWeight: 600,
          textAlign: "center",
        }}
      >
        Parth Sunil Khairnar
      </div>
      <div
        style={{
          color: "rgba(255,255,255,0.45)",
          fontSize: "12px",
          textAlign: "center",
          marginTop: "3px",
        }}
      >
        Full Stack Developer
      </div>
    </div>

    <SectionHeading>About Me</SectionHeading>
    <p
      style={{
        color: "rgba(255,255,255,0.72)",
        fontSize: "13px",
        lineHeight: "1.85",
        margin: "0 0 14px",
      }}
    >
      B.Tech Computer Technology student passionate about building scalable,
      real-world systems that combine intelligent backend architecture with
      immersive user experiences.
    </p>
    <p
      style={{
        color: "rgba(255,255,255,0.72)",
        fontSize: "13px",
        lineHeight: "1.85",
        margin: "0 0 14px",
      }}
    >
      Built Tork AI — a multimodal enterprise knowledge platform leveraging RAG,
      semantic search with pgvector, and scalable object storage through MinIO.
      Contributed to a production-focused 4-layer behavioral bot detection
      system at Autherity.
    </p>
    <p
      style={{
        color: "rgba(255,255,255,0.72)",
        fontSize: "13px",
        lineHeight: "1.85",
        margin: 0,
      }}
    >
      Deeply interested in backend infrastructure, API design, distributed
      architectures, AI pipelines, and performance optimization.
    </p>
  </div>
);

const ProjectCard = ({ project }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      style={{
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "10px",
        marginBottom: "12px",
        overflow: "hidden",
        background: "rgba(255,255,255,0.02)",
      }}
    >
      {/* Card header — always visible, tap to expand */}
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: "100%",
          padding: "14px 16px",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div
            style={{
              color: "#00e5a0",
              fontSize: "13px",
              fontWeight: 600,
              marginBottom: "2px",
            }}
          >
            📁 {project.title}
          </div>
          <div style={{ color: "rgba(255,255,255,0.40)", fontSize: "11px" }}>
            {project.subtitle}
          </div>
        </div>
        <span
          style={{
            color: "#ce93d8",
            fontSize: "18px",
            lineHeight: 1,
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.25s ease",
            flexShrink: 0,
            marginLeft: "8px",
          }}
        >
          ›
        </span>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div
          style={{
            padding: "0 16px 16px",
            borderTop: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <SectionHeading>Overview</SectionHeading>
          <p
            style={{
              color: "rgba(255,255,255,0.70)",
              fontSize: "12.5px",
              lineHeight: "1.8",
              margin: "0 0 16px",
            }}
          >
            {project.overview}
          </p>

          <SectionHeading>Tech Stack</SectionHeading>
          <div style={{ marginBottom: "16px" }}>
            {project.techStack.map((t) => (
              <Tag key={t} label={t} />
            ))}
          </div>

          <SectionHeading>Engineering Challenges</SectionHeading>
          {project.challenges.map((c, i) => (
            <div
              key={i}
              style={{
                marginBottom: "12px",
                padding: "10px 12px",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "8px",
                background: "rgba(255,255,255,0.02)",
              }}
            >
              <div
                style={{
                  color: "#29b6f6",
                  fontSize: "12px",
                  fontWeight: 500,
                  marginBottom: "8px",
                }}
              >
                {i + 1}. {c.title}
              </div>

              <div
                style={{
                  color: "#ff5f57",
                  fontSize: "10px",
                  letterSpacing: "0.6px",
                  marginBottom: "3px",
                }}
              >
                PROBLEM
              </div>
              <p
                style={{
                  color: "rgba(255,255,255,0.60)",
                  fontSize: "12px",
                  lineHeight: "1.75",
                  margin: "0 0 8px",
                }}
              >
                {c.problem}
              </p>

              <div
                style={{
                  color: "#febc2e",
                  fontSize: "10px",
                  letterSpacing: "0.6px",
                  marginBottom: "3px",
                }}
              >
                SOLUTION
              </div>
              <p
                style={{
                  color: "rgba(255,255,255,0.60)",
                  fontSize: "12px",
                  lineHeight: "1.75",
                  margin: "0 0 8px",
                }}
              >
                {c.solution}
              </p>

              <div
                style={{
                  color: "#28c840",
                  fontSize: "10px",
                  letterSpacing: "0.6px",
                  marginBottom: "3px",
                }}
              >
                RESULT
              </div>
              <p
                style={{
                  color: "rgba(255,255,255,0.60)",
                  fontSize: "12px",
                  lineHeight: "1.75",
                  margin: 0,
                }}
              >
                {c.result}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ProjectsView = () => (
  <div style={{ padding: "20px 16px" }}>
    <SectionHeading>Projects</SectionHeading>
    {PROJECTS.map((p) => (
      <ProjectCard key={p.key} project={p} />
    ))}
  </div>
);

const SkillsView = () => (
  <div style={{ padding: "20px 16px" }}>
    <SectionHeading>Tech Stack</SectionHeading>
    {SKILLS.map((group, i) => (
      <div key={i} style={{ marginBottom: "18px" }}>
        <div
          style={{
            color: "rgba(255,255,255,0.30)",
            fontSize: "10px",
            textTransform: "uppercase",
            letterSpacing: "1px",
            marginBottom: "8px",
          }}
        >
          {group.category}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {group.items.map((item) => (
            <Tag key={item} label={item} />
          ))}
        </div>
      </div>
    ))}
  </div>
);

const InternshipView = () => (
  <div style={{ padding: "20px 16px", textAlign: "left" }}>
    <SectionHeading>Work Experience</SectionHeading>

    <div
      style={{
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "10px",
        padding: "14px",
        background: "rgba(255,255,255,0.02)",
      }}
    >
      {/* Company + badge + date */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          flexWrap: "wrap",
          marginBottom: "3px",
        }}
      >
        <span style={{ color: "#00e5a0", fontWeight: 600, fontSize: "14px" }}>
          {INTERNSHIP.company}
        </span>
        <span
          style={{
            color: "rgba(255,255,255,0.30)",
            fontSize: "11px",
            border: "1px solid rgba(255,255,255,0.10)",
            borderRadius: "4px",
            padding: "1px 7px",
          }}
        >
          {INTERNSHIP.type}
        </span>
        <span
          style={{
            color: "rgba(255,255,255,0.25)",
            fontSize: "11px",
            marginLeft: "auto",
          }}
        >
          {INTERNSHIP.duration}
        </span>
      </div>

      {/* Role */}
      <div style={{ color: "#29b6f6", fontSize: "12px", marginBottom: "12px" }}>
        {INTERNSHIP.role}
      </div>

      {/* Role bullet */}
      {INTERNSHIP.roleBullets.map((point, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "flex-start",
            color: "rgba(255,255,255,0.65)",
            fontSize: "12.5px",
            lineHeight: "1.75",
            marginBottom: "12px",
          }}
        >
          <span style={{ color: "#29b6f6", flexShrink: 0, marginTop: "2px" }}>
            →
          </span>
          <span>{point}</span>
        </div>
      ))}

      {/* Project block with left border */}
      <div
        style={{
          borderLeft: "2px solid rgba(206,147,216,0.35)",
          paddingLeft: "12px",
        }}
      >
        <div
          style={{
            color: "#ce93d8",
            fontSize: "10px",
            letterSpacing: "0.6px",
            textTransform: "uppercase",
            marginBottom: "10px",
          }}
        >
          Project — {INTERNSHIP.project}
        </div>
        {INTERNSHIP.projectBullets.map((point, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "flex-start",
              color: "rgba(255,255,255,0.65)",
              fontSize: "12.5px",
              lineHeight: "1.75",
              marginBottom: "8px",
            }}
          >
            <span style={{ color: "#ce93d8", flexShrink: 0, marginTop: "2px" }}>
              →
            </span>
            <span>{point}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const ContactView = () => (
  <div style={{ padding: "20px 16px" }}>
    <SectionHeading>Get In Touch</SectionHeading>
    <div style={{ marginBottom: "20px" }}>
      {CONTACTS.map(({ emoji, label, href, display }) => (
        <a
          key={label}
          href={href}
          target={href.startsWith("mailto:") ? undefined : "_blank"}
          rel="noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "12px 14px",
            marginBottom: "8px",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "8px",
            background: "rgba(255,255,255,0.02)",
            textDecoration: "none",
          }}
        >
          <span style={{ fontSize: "18px" }}>{emoji}</span>
          <div>
            <div
              style={{
                color: "rgba(255,255,255,0.35)",
                fontSize: "10px",
                letterSpacing: "0.6px",
                textTransform: "uppercase",
                marginBottom: "2px",
              }}
            >
              {label}
            </div>
            <div style={{ color: "#29b6f6", fontSize: "12px" }}>{display}</div>
          </div>
        </a>
      ))}
    </div>
    <div
      style={{
        color: "rgba(255,255,255,0.35)",
        fontSize: "12px",
        lineHeight: "1.7",
        textAlign: "center",
        paddingTop: "8px",
      }}
    >
      Open to internships, collaborations, and opportunities.
      <br />
      <span style={{ color: "#ce93d8" }}>Feel free to reach out.</span>
    </div>
  </div>
);

// ─── Tab config ─────────────────────────────────────────────────────────────

// Replace the existing TABS array with:
const TABS = [
  { id: "about", label: "About", icon: "◉" },
  { id: "projects", label: "Projects", icon: "📁" },
  { id: "skills", label: "Skills", icon: "⚡" },
  { id: "internship", label: "Work", icon: "💼" },
  { id: "contact", label: "Contact", icon: "✉" },
];

// ─── Main component ──────────────────────────────────────────────────────────

const MobilePortfolio = () => {
  const [booted, setBooted] = useState(false);
  const [shownLines, setShownLines] = useState([]);
  const [activeTab, setActiveTab] = useState("about");

  // Boot sequence — same personality as the desktop terminal
  useEffect(() => {
    BOOT_LINES.forEach((line, i) => {
      setTimeout(() => {
        setShownLines((prev) => [...prev, line]);
        if (i === BOOT_LINES.length - 1) {
          setTimeout(() => setBooted(true), 600);
        }
      }, i * 450);
    });
  }, []);

  // ── Boot screen ──
  if (!booted) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "#0d0d17",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "0 28px",
          fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
        }}
      >
        {shownLines.map((line, i) => (
          <div
            key={i}
            style={{
              color: "#5af78e",
              fontSize: "13px",
              lineHeight: "2",
              marginBottom: "2px",
            }}
          >
            {line}
          </div>
        ))}
        {/* Blinking cursor */}
        <div
          style={{
            width: "9px",
            height: "16px",
            background: "#5af78e",
            marginTop: "4px",
            animation: "blink 1s step-end infinite",
          }}
        />
        <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
      </div>
    );
  }

  // ── Main UI ──
  const ViewComponent = {
    about: AboutView,
    projects: ProjectsView,
    skills: SkillsView,
    internship: InternshipView, // ← add this line
    contact: ContactView,
  }[activeTab];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#0d0d17",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Fira Code', 'JetBrains Mono', 'Courier New', monospace",
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          flexShrink: 0,
          padding: "14px 16px 12px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(22,22,36,0.99)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {/* Traffic lights — purely decorative, preserves desktop branding */}
          {["#ff5f57", "#febc2e", "#28c840"].map((c, i) => (
            <div
              key={i}
              style={{
                width: 9,
                height: 9,
                borderRadius: "50%",
                background: c,
              }}
            />
          ))}
          <span
            style={{
              color: "rgba(255,255,255,0.30)",
              fontSize: "11px",
              marginLeft: "6px",
              fontFamily: "'Helvetica Neue', sans-serif",
            }}
          >
            shell — parth@MacBook-Pro
          </span>
        </div>
      </div>

      {/* ── Scrollable content area ── */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <ViewComponent />
      </div>

      {/* ── Bottom tab bar ── */}
      {/*
        WHY A BOTTOM TAB BAR?
        Bottom navigation is the industry standard for mobile apps (iOS HIG, Material Design).
        Thumb reaches the bottom naturally — top nav requires a stretch that causes "thumb death".
        Each tab replaces the "brew <command>" concept from the desktop terminal.
      */}
      <div
        style={{
          flexShrink: 0,
          display: "flex",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(13,13,23,0.98)",
          paddingBottom:
            "env(safe-area-inset-bottom)" /* handles iPhone notch */,
        }}
      >
        {TABS.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: "10px 4px 8px",
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "3px",
              }}
            >
              <span style={{ fontSize: "16px", lineHeight: 1 }}>
                {tab.icon}
              </span>
              <span
                style={{
                  fontSize: "9px",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                  color: active ? "#00e5a0" : "rgba(255,255,255,0.30)",
                  fontFamily: "monospace",
                  transition: "color 0.15s",
                }}
              >
                {tab.label}
              </span>
              {/* Active indicator dot */}
              {active && (
                <div
                  style={{
                    width: "4px",
                    height: "4px",
                    borderRadius: "50%",
                    background: "#00e5a0",
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MobilePortfolio;

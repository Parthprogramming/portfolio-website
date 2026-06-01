import React, { useState, useEffect, useRef } from "react";
import TorkAIProject from "./projects/TorkAIProject";
import ProjectContainer from "./projects/ProjectContainer";
const BOOT_LINES = [
  "[✓] Detecting environment...",
  `[✓] Local timezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}`,
  "[✓] Session initialized",
];

const TerminalContainer = () => {
  const [visible, setVisible] = useState(false);
  const [shownLines, setShownLines] = useState([]);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [input, setInput] = useState("");

  const [history, setHistory] = useState([]); // { type: "cmd" | "output", content }
  const [selectorActive, setSelectorActive] = useState(false);
  const [selectorIndex, setSelectorIndex] = useState(0);
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionIndex, setSuggestionIndex] = useState(-1);
  const bodyRef = useRef(null);

  const PROJECTS = [
    { key: "tork-ai", label: "📁 Tork AI" },
    { key: "bot-detection", label: "📁 Human Bot Detection System" },
  ];

  const SKILLS = [
    {
      category: "Languages",
      items: [
        { name: "Python", icon: "/Python-logo.webp" },
        { name: "JavaScript", icon: "/JavaScript-logo.png" },
      ],
    },
    {
      category: "Frontend",
      items: [
        { name: "React.js", icon: "/react.svg" },
        { name: "HTML5", icon: "/HTML5-Logo.webp" },
        { name: "CSS3", icon: "/CSS-Logo.png" },
      ],
    },
    {
      category: "Backend",
      items: [
        { name: "Django", icon: "/django-logo.png" },
        { name: "Express.js", icon: "/express-js-logo.png" },
      ],
    },
    {
      category: "Databases",
      items: [
        { name: "PostgreSQL", icon: "/Postgresql_logo.png" },
        { name: "MySQL", icon: "/Mysql_logo.png" },
      ],
    },
    {
      category: "DevOps & Tools",
      items: [
        { name: "Docker", icon: "/docker-logo.jpg" },
        { name: "Git", icon: "/git-logo.png" },
        { name: "Jenkins", icon: "/Jenkins_logo.png" },
      ],
    },
  ];

  const ALL_COMMANDS = [
    "brew about",
    "brew projects",
    "brew skills",
    "brew contacts",
    "brew internship",
    "brew clear",
    "brew help",
  ];

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  useEffect(() => {
    if (!visible) return;

    BOOT_LINES.forEach((line, i) => {
      setTimeout(() => {
        setShownLines((prev) => [...prev, line]);

        if (i === BOOT_LINES.length - 1) {
          setTimeout(() => {
            setShowPrompt(true);
            setTimeout(() => setShowWelcome(true), 800); // 800ms after prompt
          }, 500);
        }
      }, i * 500); // each line 500ms apart
    });
  }, [visible]);

  const ABOUT_TEXT = `Greetings! My Name is Parth Sunil Khairnar, a Full Stack Developer and B.Tech Computer Technology student passionate about building scalable, real-world systems that combine intelligent backend architecture with immersive user experiences. Experienced in developing applications using React.js, Django, PostgreSQL, and modern AI-powered workflows.

Built Tork AI — a multimodal enterprise knowledge platform leveraging RAG, semantic search with pgvector, and scalable object storage through MinIO. Contributed to a production-focused 4-layer behavioral bot detection system at Autherity, validated against Selenium, Playwright, and Puppeteer stealth bots.

Deeply interested in backend infrastructure, API design, authentication flows, distributed architectures, AI pipelines, and performance optimization. Currently seeking opportunities as a Full Stack Developer while growing as a systems-focused software engineer.`;

  const handleCommand = (cmd) => {
    const trimmed = cmd.trim().toLowerCase();

    // Push the typed command into history first
    setHistory((prev) => [...prev, { type: "cmd", content: cmd }]);

    switch (trimmed) {
      case "brew about":
        setHistory((prev) => [...prev, { type: "about", content: ABOUT_TEXT }]);
        break;
      case "brew clear":
        setHistory([]);
        break;
      case "brew help":
        setHistory((prev) => [...prev, { type: "help" }]);
        break;
      case "brew projects":
        setSelectorActive(true);
        setSelectorIndex(0);
        setHistory((prev) => [...prev, { type: "project-selector" }]);
        break;
      case "brew skills":
        setHistory((prev) => [...prev, { type: "skills", content: SKILLS }]);
        break;
      case "brew contacts":
        setHistory((prev) => [...prev, { type: "contacts" }]);
        break;
      case "brew internship":
        setHistory((prev) => [...prev, { type: "internship" }]);
        break;

      default:
        setHistory((prev) => [
          ...prev,
          {
            type: "error",
            content: `brew: unknown command '${cmd.trim()}'. Type 'brew help' to see available commands.`,
          },
        ]);
    }
  };

  const handleKeyDown = (e) => {
    // ── Suggestion navigation ──
    if (suggestions.length > 0) {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSuggestionIndex((prev) =>
          prev <= 0 ? suggestions.length - 1 : prev - 1,
        );
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSuggestionIndex((prev) =>
          prev >= suggestions.length - 1 ? 0 : prev + 1,
        );
        return;
      }
      if (e.key === "Tab" || (e.key === "Enter" && suggestionIndex >= 0)) {
        // Tab always picks first suggestion; Enter picks highlighted one
        e.preventDefault();
        const picked = suggestions[suggestionIndex >= 0 ? suggestionIndex : 0];
        setInput(picked);
        setSuggestions([]);
        setSuggestionIndex(-1);
        return;
      }
      if (e.key === "Escape") {
        setSuggestions([]);
        setSuggestionIndex(-1);
        return;
      }
    }

    // ── Project selector navigation (your existing logic, unchanged) ──
    if (selectorActive) {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectorIndex(
          (prev) => (prev - 1 + PROJECTS.length) % PROJECTS.length,
        );
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectorIndex((prev) => (prev + 1) % PROJECTS.length);
      } else if (e.key === "Enter") {
        const selected = PROJECTS[selectorIndex];
        setSelectorActive(false);
        setHistory((prev) => [
          ...prev,
          { type: "project-detail", key: selected.key, label: selected.label },
        ]);
        setSelectorIndex(0);
      } else if (e.key === "Escape") {
        setSelectorActive(false);
        setSelectorIndex(0);
      }
      return;
    }

    // ── Normal Enter to run command ──
    if (e.key === "Enter" && input.trim()) {
      handleCommand(input);
      setInput("");
      setSuggestions([]);
      setSuggestionIndex(-1);
    }
  };

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [history]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.7s ease",
        zIndex: 10,
      }}
    >
      <div
        style={{
          width: "70%",
          height: "85%",
          background: "rgba(13, 13, 23, 0.97)",
          borderRadius: "10px",
          boxShadow: "0 40px 100px rgba(0,0,0,0.85)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        {/* ── Title bar ── */}
        <div
          style={{
            height: "40px",
            background: "rgba(22, 22, 36, 0.99)",
            display: "flex",
            alignItems: "center",
            padding: "0 16px",
            gap: "8px",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            flexShrink: 0,
          }}
        >
          {["#ff5f57", "#febc2e", "#28c840"].map((c, i) => (
            <div
              key={i}
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: c,
              }}
            />
          ))}
          <span
            style={{
              flex: 1,
              textAlign: "center",
              marginRight: "52px",
              color: "rgba(255,255,255,0.35)",
              fontSize: "13px",
              fontFamily: "'Helvetica Neue', sans-serif",
            }}
          >
            shell — parth@MacBook-Pro
          </span>
        </div>

        {/* ── Tab bar ── */}
        <div
          style={{
            height: "34px",
            background: "rgba(18, 18, 30, 0.99)",
            display: "flex",
            alignItems: "center",
            padding: "0 12px",
            borderBottom: "1px solid rgba(255,255,255,0.04)",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              padding: "3px 18px",
              background: "rgba(255,255,255,0.06)",
              borderRadius: "4px",
              color: "rgba(255,255,255,0.65)",
              fontSize: "12px",
              fontFamily: "monospace",
            }}
          >
            shell
          </div>
        </div>

        {/* ── Terminal body ── */}
        <div
          ref={bodyRef}
          style={{
            flex: 1,
            padding: "22px 28px",
            fontFamily:
              "'Fira Code', 'JetBrains Mono', 'Courier New', monospace",
            fontSize: "14.5px",
            lineHeight: "1.9",
            color: "#f0f0f0", // crisper white, not warm grey
            letterSpacing: "0.02em", // slight spacing — Hyper's signature airy feel
            overflowY: "auto",
          }}
        >
          

          {shownLines.map((line, i) => (
            <div key={i} style={{ color: "#5af78e", marginBottom: "3px" }}>
              {line}
            </div>
          ))}

          {showWelcome && (
            <div style={{ marginTop: "18px" }}>
              {/* ── Welcome message ── */}
              <div
                style={{
                  color: "#e2e2e2",
                  marginBottom: "12px",
                  lineHeight: "1.9",
                }}
              >
                <div>Welcome, Visitor.</div>
                <div
                  style={{ color: "rgba(255,255,255,0.55)", fontSize: "13px" }}
                >
                  Thank you for visiting my portfolio website. Explore the
                  system using the commands below.
                </div>
              </div>

              {/* ── Available commands ── */}
              <div
                style={{
                  color: "rgba(255,255,255,0.35)",
                  marginBottom: "6px",
                  fontSize: "13px",
                }}
              >
                Available Commands:
              </div>
              {[
                { cmd: "brew about", desc: "Who am I" },
                { cmd: "brew projects", desc: "Things I've built" },
                { cmd: "brew skills", desc: "My tech stack" },
                { cmd: "brew contacts", desc: "Get in touch" },
                { cmd: "brew internship", desc: "Internship Work" },
                { cmd: "brew clear", desc: "Clear the terminal" },
                { cmd: "brew help", desc: "Show this menu again" },
              ].map(({ cmd, desc }) => (
                <div
                  key={cmd}
                  style={{ display: "flex", gap: "16px", marginBottom: "2px" }}
                >
                  <span style={{ color: "#ce93d8", minWidth: "160px" }}>
                    {cmd}
                  </span>
                  <span
                    style={{
                      color: "rgba(255,255,255,0.35)",
                      fontSize: "13px",
                    }}
                  >
                    {desc}
                  </span>
                </div>
              ))}

              {/* ── Command history output ── */}
              {history.map((entry, i) => {
                if (entry.type === "cmd")
                  return (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: "6px",
                      }}
                    >
                      <span style={{ color: "#00e5a0" }}>parth</span>
                      <span style={{ color: "rgba(255,255,255,0.35)" }}>@</span>
                      <span style={{ color: "#29b6f6" }}>MacBook-Pro</span>
                      <span style={{ color: "rgba(255,255,255,0.35)" }}>
                        &nbsp;~&nbsp;
                      </span>
                      <span style={{ color: "#ce93d8" }}>%&nbsp;</span>
                      <span style={{ color: "#e2e2e2" }}>{entry.content}</span>
                    </div>
                  );

                if (entry.type === "about")
                  return (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        gap: "28px",
                        marginTop: "14px",
                        alignItems: "flex-start",
                      }}
                    >
                      {/* Photo */}
                      <img
                        src="/about_photo.JPG"
                        alt="Parth Khairnar"
                        style={{
                          width: "130px",
                          height: "160px",
                          objectFit: "cover",
                          borderRadius: "8px",
                          border: "1px solid rgba(255,255,255,0.12)",
                          flexShrink: 0,
                        }}
                      />
                      {/* Text */}
                      <div
                        style={{
                          color: "rgba(255,255,255,0.80)",
                          fontSize: "13px",
                          lineHeight: "1.85",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {entry.content}
                      </div>
                    </div>
                  );

                if (entry.type === "error")
                  return (
                    <div
                      key={i}
                      style={{
                        color: "#ff5f57",
                        marginTop: "6px",
                        fontSize: "13px",
                      }}
                    >
                      {entry.content}
                    </div>
                  );

                if (entry.type === "help")
                  return (
                    <div key={i} style={{ marginTop: "10px" }}>
                      <div
                        style={{
                          color: "rgba(255,255,255,0.35)",
                          marginBottom: "6px",
                          fontSize: "13px",
                        }}
                      >
                        Available Commands:
                      </div>
                      {[
                        { cmd: "brew about", desc: "Who am I" },
                        { cmd: "brew projects", desc: "Things I've built" },
                        { cmd: "brew skills", desc: "My tech stack" },
                        { cmd: "brew contact", desc: "Get in touch" },
                        { cmd: "brew internship", desc: "Internship Work" },
                        { cmd: "brew clear", desc: "Clear the terminal" },
                        { cmd: "brew help", desc: "Show this menu again" },
                      ].map(({ cmd, desc }) => (
                        <div
                          key={cmd}
                          style={{
                            display: "flex",
                            gap: "16px",
                            marginBottom: "2px",
                          }}
                        >
                          <span style={{ color: "#ce93d8", minWidth: "160px" }}>
                            {cmd}
                          </span>
                          <span
                            style={{
                              color: "rgba(255,255,255,0.35)",
                              fontSize: "13px",
                            }}
                          >
                            {desc}
                          </span>
                        </div>
                      ))}
                    </div>
                  );
                if (entry.type === "project-selector")
                  return (
                    <div key={i} style={{ marginTop: "10px" }}>
                      <div
                        style={{
                          color: "rgba(255,255,255,0.45)",
                          fontSize: "13px",
                          marginBottom: "6px",
                        }}
                      >
                        ? Select a project: » - Use arrow-keys. Return to
                        submit.
                      </div>
                      {PROJECTS.map((p, pi) => (
                        <div
                          key={p.key}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            fontSize: "13px",
                            color:
                              selectorActive && pi === selectorIndex
                                ? "#ffffff"
                                : "rgba(255,255,255,0.45)",
                            marginBottom: "2px",
                          }}
                        >
                          <span style={{ width: "12px" }}>
                            {selectorActive && pi === selectorIndex ? ">" : " "}
                          </span>
                          <span>{p.label}</span>
                        </div>
                      ))}
                    </div>
                  );

                if (entry.type === "project-detail")
                  return (
                    <div key={i}>
                      <ProjectContainer projectKey={entry.key} />
                    </div>
                  );

                {
                  /* Skills */
                }
                if (entry.type === "skills")
                  return (
                    <>
                      <div style={{ color: "#ce93d8", margin: "18px 0 8px" }}>
                        Skills
                      </div>
                      {SKILLS.map((group, gi) => (
                        <div key={gi} style={{ marginBottom: "14px" }}>
                          <div
                            style={{
                              color: "rgba(255,255,255,0.35)",
                              fontSize: "10.5px",
                              marginBottom: "6px",
                              textTransform: "uppercase",
                              letterSpacing: "0.9px",
                              textAlign: "left",
                            }}
                          >
                            {group.category}
                          </div>
                          <div
                            style={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: "8px",
                            }}
                          >
                            {group.items.map((item, ii) => (
                              <div
                                key={ii}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "8px",
                                  padding: "5px 12px",
                                  border: "1px solid rgba(255,255,255,0.13)",
                                  borderRadius: "6px",
                                  background: "rgba(255,255,255,0.04)",
                                }}
                              >
                                <img
                                  src={item.icon}
                                  alt={item.name}
                                  style={{
                                    width: "16px",
                                    height: "16px",
                                    objectFit: "contain",
                                    mixBlendMode: "screen", // ← knocks out black backgrounds (CSS, MySQL, Jenkins logos)
                                  }}
                                />
                                <span
                                  style={{
                                    color: "rgba(255,255,255,0.75)",
                                    fontSize: "12px",
                                  }}
                                >
                                  {item.name}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </>
                  );

                if (entry.type === "contacts")
                  return (
                    <>
                      <div
                        key={i}
                        style={{ marginTop: "10px", fontSize: "13px" }}
                      >
                        {/* Loading line */}
                        <div
                          style={{
                            color: "rgba(255,255,255,0.4)",
                            marginBottom: "10px",
                          }}
                        >
                          Loading communication channels...
                        </div>

                        {/* Divider */}
                        <div
                          style={{
                            color: "rgba(255,255,255,0.15)",
                            marginBottom: "10px",
                          }}
                        >
                          ────────────────────────────
                        </div>

                        {/* Name + Title */}
                        <div
                          style={{
                            color: "#00e5a0",
                            fontWeight: 600,
                            marginBottom: "2px",
                          }}
                        >
                          Parth Khairnar
                        </div>
                        <div
                          style={{
                            color: "rgba(255,255,255,0.45)",
                            marginBottom: "12px",
                          }}
                        >
                          Full Stack Developer
                        </div>

                        {/* Contact Links */}
                        {[
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
                        ].map(({ emoji, label, href, display }) => (
                          <div
                            key={label}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                              marginBottom: "6px",
                            }}
                          >
                            <span>{emoji}</span>
                            <span
                              style={{
                                color: "rgba(255,255,255,0.35)",
                                minWidth: "70px",
                              }}
                            >
                              {label}
                            </span>
                            <a
                              href={href}
                              target={
                                href.startsWith("mailto:")
                                  ? undefined
                                  : "_blank"
                              }
                              rel="noreferrer"
                              style={{
                                color: "#29b6f6",
                                textDecoration: "none",
                              }}
                              onMouseEnter={(e) =>
                                (e.target.style.textDecoration = "underline")
                              }
                              onMouseLeave={(e) =>
                                (e.target.style.textDecoration = "none")
                              }
                            >
                              {display}
                            </a>
                          </div>
                        ))}

                        {/* Divider */}
                        <div
                          style={{
                            color: "rgba(255,255,255,0.15)",
                            margin: "10px 0",
                          }}
                        >
                          ────────────────────────────
                        </div>

                        {/* Footer message */}
                        <div
                          style={{
                            color: "rgba(255,255,255,0.4)",
                            lineHeight: "1.7",
                          }}
                        >
                          Thank you for visiting my portfolio.
                          <br />
                          Feel free to connect or reach out regarding
                          <br />
                          <span style={{ color: "#ce93d8" }}>
                            internships, collaborations, or opportunities.
                          </span>
                        </div>
                      </div>
                    </>
                  );

                if (entry.type === "internship")
                  return (
                    <div
                      key={i}
                      style={{
                        marginTop: "10px",
                        fontSize: "13px",
                        textAlign: "left",
                      }}
                    >
                      {/* ── Company + Date row ── */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          marginBottom: "2px",
                        }}
                      >
                        <span style={{ color: "#00e5a0", fontWeight: 600 }}>
                          Autherity
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
                          Internship
                        </span>
                        <span
                          style={{
                            color: "rgba(255,255,255,0.25)",
                            fontSize: "11px",
                            marginLeft: "auto",
                          }}
                        >
                          Apr 2024 – Feb 2026
                        </span>
                      </div>

                      {/* ── Role badge ── */}
                      <div
                        style={{
                          color: "#29b6f6",
                          fontSize: "12px",
                          marginBottom: "14px",
                        }}
                      >
                        Frontend Developer
                      </div>

                      {/* ── Frontend bullet ── */}
                      <div
                        style={{
                          display: "flex",
                          gap: "10px",
                          alignItems: "flex-start",
                          color: "rgba(255,255,255,0.65)",
                          fontSize: "12.5px",
                          lineHeight: "1.75",
                          marginBottom: "14px",
                          maxWidth: "620px",
                        }}
                      >
                        <span
                          style={{
                            color: "#29b6f6",
                            flexShrink: 0,
                            marginTop: "2px",
                          }}
                        >
                          →
                        </span>
                        <span>
                          Engineered responsive, accessible UI components using
                          React.js, serving internal dashboard users across
                          multiple devices and screen sizes.
                        </span>
                      </div>

                      {/* ── Project block ── */}
                      <div
                        style={{
                          borderLeft: "2px solid rgba(206,147,216,0.35)",
                          paddingLeft: "14px",
                          marginBottom: "6px",
                        }}
                      >
                        {/* Project label */}
                        <div
                          style={{
                            color: "#ce93d8",
                            fontSize: "11px",
                            letterSpacing: "0.6px",
                            textTransform: "uppercase",
                            marginBottom: "10px",
                          }}
                        >
                          Project — Human Bot Detection System
                        </div>

                        {[
                          "Designed and implemented a 4-layer bot detection engine (Behavioral, Network, Browser, Temporal layers) with site-key/secret-key-based secure verification — achieving a low false-positive rate in adversarial testing.",
                          "Validated system robustness against Selenium, Playwright, and Puppeteer stealth automation bots through structured adversarial test campaigns.",
                          "Integrated RESTful API endpoints between React.js frontend and backend services, ensuring seamless data flow and secure authentication.",
                        ].map((point, idx) => (
                          <div
                            key={idx}
                            style={{
                              display: "flex",
                              gap: "10px",
                              alignItems: "flex-start",
                              color: "rgba(255,255,255,0.65)",
                              fontSize: "12.5px",
                              lineHeight: "1.75",
                              marginBottom: "8px",
                              maxWidth: "600px",
                            }}
                          >
                            <span
                              style={{
                                color: "#ce93d8",
                                flexShrink: 0,
                                marginTop: "2px",
                              }}
                            >
                              →
                            </span>
                            <span>{point}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );

                return null;
              })}

              {/* ── Active input prompt ── */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: "10px",
                  position: "relative"
                }}
              >
                <span style={{ color: "#00e5a0" }}>parth</span>
                <span style={{ color: "rgba(255,255,255,0.35)" }}>@</span>
                <span style={{ color: "#29b6f6" }}>MacBook-Pro</span>
                <span style={{ color: "rgba(255,255,255,0.35)" }}>
                  &nbsp;~&nbsp;
                </span>
                <span style={{ color: "#ce93d8" }}>%&nbsp;</span>
                {/* Autocomplete dropdown — sits above the input line */}
                {suggestions.length > 0 && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: "100%", // floats above the input row
                      left: "0",
                      marginBottom: "6px",
                      background: "rgba(18, 18, 30, 0.97)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "6px",
                      overflow: "hidden",
                      minWidth: "220px",
                      zIndex: 20,
                      boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                    }}
                  >
                    {suggestions.map((cmd, idx) => (
                      <div
                        key={cmd}
                        onMouseEnter={() => setSuggestionIndex(idx)}
                        onMouseDown={(e) => {
                          // mouseDown fires before input blur — prevent blur killing the dropdown
                          e.preventDefault();
                          setInput(cmd);
                          setSuggestions([]);
                          setSuggestionIndex(-1);
                        }}
                        style={{
                          padding: "6px 14px",
                          fontSize: "13px",
                          fontFamily: "inherit",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          background:
                            idx === suggestionIndex
                              ? "rgba(255,255,255,0.06)"
                              : "transparent",
                          borderBottom:
                            idx < suggestions.length - 1
                              ? "1px solid rgba(255,255,255,0.04)"
                              : "none",
                          transition: "background 0.1s",
                        }}
                      >
                        {/* Highlight the matching prefix in a different color */}
                        <span style={{ color: "#ce93d8" }}>
                          {cmd.slice(0, input.length)}
                        </span>
                        <span style={{ color: "rgba(255,255,255,0.50)" }}>
                          {cmd.slice(input.length)}
                        </span>
                      </div>
                    ))}

                    {/* Footer hint */}
                    <div
                      style={{
                        padding: "4px 14px",
                        fontSize: "10px",
                        color: "rgba(255,255,255,0.20)",
                        borderTop: "1px solid rgba(255,255,255,0.05)",
                        letterSpacing: "0.4px",
                      }}
                    >
                      ↑↓ navigate · Tab to select · Esc to dismiss
                    </div>
                  </div>
                )}
                <input
                  autoFocus
                  value={input}
                  onChange={(e) => {
                    const val = e.target.value;
                    setInput(val);
                    setSuggestionIndex(-1); // reset highlight on every keystroke

                    if (val.trim() === "") {
                      setSuggestions([]);
                      return;
                    }
                    // Only show suggestions if input matches the start of a command
                    const matched = ALL_COMMANDS.filter((cmd) =>
                      cmd.startsWith(val.toLowerCase()),
                    );
                    // Don't show dropdown if it's already an exact match
                    setSuggestions(
                      matched.length === 1 && matched[0] === val ? [] : matched,
                    );
                  }}
                  onKeyDown={handleKeyDown}
                  style={{
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    color: "#e2e2e2",
                    fontFamily: "inherit",
                    fontSize: "14px",
                    flex: 1,
                    caretColor: "rgba(255,255,255,0.85)",
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes blink {
          0%,100% { opacity:1; } 50% { opacity:0; }
        }
      `}</style>
    </div>
  );
};

export default TerminalContainer;

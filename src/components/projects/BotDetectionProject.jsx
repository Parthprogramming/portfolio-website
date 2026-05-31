import React from "react";

const OVERVIEW = [
  "Developed a multi-layer Human Bot Detection system designed to distinguish genuine users from automated bots without relying on traditional CAPTCHAs.",
  "Built a probabilistic verification pipeline that evaluates user authenticity through Behavioral Analysis, Network Analysis, Browser Integrity Validation, and Temporal Consistency monitoring.",
  "Designed a secure Site Key and Secret Key verification architecture, enabling websites to securely integrate with the detection service while preventing unauthorized verification requests.",
  "Implemented a behavioral tracking SDK capable of collecting and analyzing 90+ browser, interaction, and behavioral signals without impacting the user experience.",
  "Developed a risk-based decision engine that combines evidence from multiple detection layers to generate trust scores, risk scores, and recommended actions.",
  "Focused on reducing false positives while maintaining strong protection against automated abuse, bots, and scripted browser automation.",
];

const WHY_BUILT = [
  "Traditional bot protection mechanisms often rely on CAPTCHAs, static rules, or single-point verification checks that negatively impact user experience.",
  "Modern automation frameworks are increasingly capable of bypassing conventional bot detection techniques, reducing their effectiveness.",
  "Built to explore a more intelligent and user-friendly approach using behavioral intelligence, browser integrity signals, and long-term interaction patterns.",
  "Designed to silently evaluate trust over time instead of making decisions based on a single interaction or request.",
  "Focused on minimizing false positives while maintaining strong protection against automated abuse.",
  "Aimed to provide organizations with a scalable verification system that enhances security without disrupting legitimate users.",
];

const TECH_STACK = [
  {
    category: "Frontend",
    items: [{ name: "React.js", icon: "/react.svg" }],
  },
  {
    category: "Behavioral Tracking",
    items: [{ name: "Custom JS SDK", icon: null }],
  },
  {
    category: "Backend",
    items: [
      { name: "Django", icon: "/django-logo.png" },
      {
        name: "Django REST Framework",
        icon: "/Django-Rest-Framework-logo.webp",
      },
    ],
  },
  {
    category: "Database",
    items: [{ name: "PostgreSQL", icon: "/Postgresql_logo.png" }],
  },
  {
    category: "Machine Learning",
    items: [
      { name: "XGBoost", icon: null },
      { name: "Random Forest", icon: null },
      { name: "Logistic Regression", icon: null },
      { name: "Scikit-Learn", icon: null },
    ],
  },
  {
    category: "Infrastructure",
    items: [
      { name: "Cloudflare Pages", icon: "/cloudfare-logo.png" },
      { name: "REST APIs", icon: null },
    ],
  },
  {
    category: "Rate Limiter",
    items: [{ name: "Redis", icon: "/redis-logo.png" }],
  },
];

const CHALLENGES = [
  {
    title: "Reducing False Positives Through Multi-Layer Detection",
    challenge: [
      "The initial system relied solely on a machine learning model to classify users as human or bot.",
      "Limited training data and a single-layer decision process resulted in a high number of false positives.",
      "Legitimate users could occasionally be flagged as bots due to insufficient verification mechanisms.",
    ],
    approach: [
      "Redesigned the architecture into a multi-layer detection framework.",
      "Introduced Network Analysis, Browser Integrity Validation, and Temporal Consistency layers alongside Behavioral Analysis.",
      "Implemented rule-based gating to identify impossible or highly suspicious conditions before producing a final verdict.",
    ],
    result: [
      "Significantly reduced false positives.",
      "Improved classification reliability and confidence.",
      "Enabled decisions to be based on multiple independent signals rather than a single ML prediction.",
    ],
    resultLabel: "Result",
  },
  {
    title: "Balancing Detection Accuracy During Backend Logic Changes",
    challenge: [
      "Introducing new behavioral metrics, thresholds, or detection rules often affected the overall classification accuracy.",
      "Small changes in backend decision logic sometimes increased false positives, causing legitimate users to be classified incorrectly.",
      "The interaction between multiple detection signals made it difficult to predict the impact of new rules.",
    ],
    approach: [
      "Continuously tested the system against known human and bot behavior patterns.",
      "Performed iterative threshold tuning and rule adjustments based on observed results.",
      "Monitored classification outcomes after each change to identify regressions.",
    ],
    result: [
      "More detection signals do not always lead to better results.",
      "Detection systems require careful balancing of rules and thresholds, as even minor changes can significantly affect overall accuracy.",
    ],
    resultLabel: "Key Learning",
  },
];

const BotDetectionProject = () => (
  <div style={{ marginTop: "10px", fontSize: "13px", lineHeight: "1.85" }}>
    {/* Title */}
    <div
      style={{
        color: "#00e5a0",
        marginBottom: "14px",
        fontSize: "14px",
        letterSpacing: "0.5px",
      }}
    >
      📁 Human Bot Detection System
    </div>

    {/* Overview */}
    <div style={{ color: "#ce93d8", marginBottom: "8px" , textAlign: "left"  }}>Overview</div>
    {OVERVIEW.map((point, i) => (
      <div
        key={i}
        style={{
          display: "flex",
          gap: "12px",
          alignItems: "flex-start", // ← critical for multi-line items
          color: "rgba(255,255,255,0.68)",
          marginBottom: "8px", // was 4px — more breathing room
          fontSize: "13px",
          lineHeight: "1.75",
          maxWidth: "680px",
        }}
      >
        <span style={{ color: "#29b6f6", flexShrink: 0, marginTop: "3px" }}>
          →
        </span>
        <span>{point}</span>
      </div>
    ))}

    {/* Why It Was Built */}
    <div style={{ color: "#ce93d8", margin: "18px 0 8px" , textAlign: "left"}}>
      Why It Was Built
    </div>
    {WHY_BUILT.map((point, i) => (
      <div
        key={i}
        style={{
          display: "flex",
          gap: "12px",
          alignItems: "flex-start", // ← critical for multi-line items
          color: "rgba(255,255,255,0.68)",
          marginBottom: "8px", // was 4px — more breathing room
          fontSize: "13px",
          lineHeight: "1.75",
          maxWidth: "680px",
        }}
      >
        <span style={{ color: "#29b6f6", flexShrink: 0, marginTop: "3px" }}>
          →
        </span>
        <span>{point}</span>
      </div>
    ))}

    {/* Architecture */}
    <div style={{ color: "#ce93d8", margin: "18px 0 8px" , textAlign: "left"}}>Architecture</div>
    <div
      style={{
        borderRadius: "10px",
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.1)",
        background: "rgba(255,255,255,0.02)",
      }}
    >
      <img
        src="/hbd_arch.png"
        alt="HBD Architecture Diagram"
        style={{ width: "100%", display: "block", objectFit: "contain" }}
      />
    </div>

    {/* Tech Stack */}
    <div style={{ color: "#ce93d8", margin: "18px 0 8px" , textAlign: "left" }}>Tech Stack</div>
    {TECH_STACK.map((group, gi) => (
      <div key={gi} style={{ marginBottom: "14px" }}>
        <div
          style={{
            color: "rgba(255,255,255,0.35)",
            fontSize: "10.5px",
            marginBottom: "6px",
            textTransform: "uppercase",
            letterSpacing: "0.9px",
            textAlign: "left"
          }}
        >
          {group.category}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px"  }}>
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
              {item.icon && (
                <img
                  src={item.icon}
                  alt={item.name}
                  style={{
                    width: "16px",
                    height: "16px",
                    objectFit: "contain",
                  }}
                />
              )}
              <span
                style={{ color: "rgba(255,255,255,0.75)", fontSize: "12px" }}
              >
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    ))}

    {/* Engineering Challenges & Solutions */}
    <div style={{ color: "#ce93d8", margin: "18px 0 8px" , textAlign: "left"}}>
      Engineering Challenges & Solutions
    </div>
    {CHALLENGES.map((item, ci) => (
      <div
        key={ci}
        style={{
          marginBottom: "16px",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "8px",
          padding: "12px 14px",
          background: "rgba(255,255,255,0.02)",
          textAlign: "left"
        }}
      >
        {/* Challenge Title */}
        <div
          style={{
            color: "#29b6f6",
            fontSize: "12.5px",
            marginBottom: "10px",
            fontWeight: 500,
          }}
        >
          {ci + 1}. {item.title}
        </div>

        {/* Challenge */}
        <div
          style={{
            color: "rgba(255,255,255,0.4)",
            fontSize: "10.5px",
            textTransform: "uppercase",
            letterSpacing: "0.8px",
            marginBottom: "5px",
          }}
        >
          Challenge
        </div>
        {item.challenge.map((point, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: "12px",
              alignItems: "flex-start", // ← critical for multi-line items
              color: "rgba(255,255,255,0.68)",
              marginBottom: "8px", // was 4px — more breathing room
              fontSize: "13px",
              lineHeight: "1.75",
              maxWidth: "680px",
            }}
          >
            <span style={{ color: "#29b6f6", flexShrink: 0, marginTop: "2px" }}>
              →
            </span>
            <span>{point}</span>
          </div>
        ))}

        {/* Approach */}
        <div
          style={{
            color: "rgba(255,255,255,0.4)",
            fontSize: "10.5px",
            textTransform: "uppercase",
            letterSpacing: "0.8px",
            margin: "10px 0 5px",
          }}
        >
          Approach Taken
        </div>
        {item.approach.map((point, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: "12px",
              alignItems: "flex-start", // ← critical for multi-line items
              color: "rgba(255,255,255,0.68)",
              marginBottom: "8px", // was 4px — more breathing room
              fontSize: "13px",
              lineHeight: "1.75",
              maxWidth: "680px",
            }}
          >
            <span style={{ color: "#29b6f6", flexShrink: 0, marginTop: "3px" }}>
              →
            </span>
            <span>{point}</span>
          </div>
        ))}

        {/* Result / Key Learning */}
        <div
          style={{
            color: "rgba(255,255,255,0.4)",
            fontSize: "10.5px",
            textTransform: "uppercase",
            letterSpacing: "0.8px",
            margin: "10px 0 5px",
          }}
        >
          {item.resultLabel}
        </div>
        {item.result.map((point, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: "12px",
              alignItems: "flex-start", // ← critical for multi-line items
              color: "rgba(255,255,255,0.68)",
              marginBottom: "8px", // was 4px — more breathing room
              fontSize: "13px",
              lineHeight: "1.75",
              maxWidth: "680px",
            }}
          >
            <span style={{ color: "#29b6f6", flexShrink: 0, marginTop: "3px" }}>
              →
            </span>
            <span>{point}</span>
          </div>
        ))}
      </div>
    ))}
  </div>
);

export default BotDetectionProject;

import React from "react";

const OVERVIEW = `Tork AI is a multimodal enterprise knowledge platform designed to help organizations efficiently store, search, and retrieve information across text, images, audio, and video. It combines Retrieval-Augmented Generation (RAG) with semantic search to provide context-aware information retrieval through a unified interface, leveraging PostgreSQL with pgvector for vector similarity search and MinIO for scalable object storage.`;

const WHY_BUILT = [
  "Large volumes of private, domain-specific data scattered across systems",
  "Employees waste significant productive time searching and verifying information",
  "Public AI tools cannot be used due to security and compliance policies",
  "Critical organizational knowledge exists but is not usable for decision-making",
];

const TECH_STACK = [
  { label: "React.js", category: "Frontend", icon: "/react.svg" },
  { label: "Django", category: "Backend", icon: "/django-logo.png" },
  {
    label: "Django REST",
    category: "Backend",
    icon: "/Django-Rest-Framework-logo.webp",
  },
  {
    label: "PostgreSQL",
    category: "Vector Retrieval",
    icon: "/Postgresql_logo.png",
  },
  {
    label: "pgvector",
    category: "Vector Retrieval",
    icon: "/pgvector-logo.svg",
  },
  { label: "Ollama", category: "LLM Layer", icon: "/ollama-logo.webp" },
  { label: "MinIO", category: "Object Storage", icon: "/minio-logo.svg" },
  { label: "JWT", category: "Authentication", icon: "/jwt-logo.png" },
  { label: "Redis", category: "Token Management", icon: "/redis-logo.png" },
  { label: "Docker", category: "Containers", icon: "/docker-logo.jpg" },
];

const CHALLENGES = [
  {
    title: "Inconsistent Retrieval of Relevant Knowledge Chunks",
    problem: `During early development, users occasionally received incomplete or irrelevant context during semantic search despite the required information being present in the knowledge base.`,
    solution: `The core retrieval logic had been implemented in an incorrect Django application layer, causing the workflow to bypass parts of the intended pipeline. We refactored by relocating the retrieval functionality to the appropriate service layer.`,
    result: `The retrieval process became significantly more reliable, consistently returning the most relevant context for downstream LLM processing and improving overall answer quality.`,
  },
  {
    title:
      "Intermittent LLM Response Failures Due to Ollama Service Availability",
    problem: `After integrating Ollama, intermittent response failures caused user queries to occasionally time out. The issue appeared inconsistent, making it difficult to reproduce initially.`,
    solution: `The Ollama service was not running persistently. The application depended on manually starting the model through the terminal before handling requests. Ollama was configured to run as a background service during system startup.`,
    result: `LLM availability became stable, timeout-related failures were eliminated, and users consistently received generated responses without manual intervention.`,
  },
];

const TorkAIProject = () => {
  return (
    <div style={{ marginTop: "10px", fontSize: "13px", lineHeight: "1.85" , textAlign: "left"}}>
      {/* Title */}
      <div
        style={{
          color: "#00e5a0",
          marginBottom: "14px",
          fontSize: "14px",
          letterSpacing: "0.5px",
        }}
      >
        📁 Tork AI — Multimodal Enterprise Knowledge Platform
      </div>

      {/* Overview */}
      <div style={{ color: "#ce93d8", marginBottom: "6px" }}>Overview</div>
      <div style={{ maxWidth: "680px", marginBottom: "18px" }}>
        {OVERVIEW.split(". ")
          .filter(Boolean)
          .map((sentence, i) => (
            <div
              key={i}
              style={{
                color: "rgba(255,255,255,0.72)",
                fontSize: "13px",
                lineHeight: "1.9",
                paddingLeft: "0",
                marginBottom: "2px",
              }}
            >
              {sentence.endsWith(".") ? sentence : sentence + "."}
            </div>
          ))}
      </div>

      {/* Why It Was Built */}
      <div style={{ color: "#ce93d8", marginBottom: "8px" }}>
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
      <div style={{ color: "#ce93d8", margin: "20px 0 10px" }}>
        Architecture
      </div>
      <img
        src="/Tork-Arch.png"
        alt="Tork AI Architecture"
        style={{
          width: "100%",
          maxWidth: "700px",
          borderRadius: "8px",
          border: "1px solid rgba(255,255,255,0.08)",
          display: "block",
        }}
      />

      {/* Tech Stack */}
      <div style={{ color: "#ce93d8", margin: "20px 0 10px" }}>Tech Stack</div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          maxWidth: "700px",
        }}
      >
        {TECH_STACK.map(({ label, icon }) => (
          <div
            key={label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 14px",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "6px",
              background: "rgba(255,255,255,0.04)",
              color: "rgba(255,255,255,0.75)",
              fontSize: "12px",
            }}
          >
            <img
              src={icon}
              alt={label}
              style={{
                width: "18px",
                height: "18px",
                objectFit: "contain",
                // White background pill for dark logos like Ollama
                background: "rgba(255,255,255,0.9)",
                borderRadius: "3px",
                padding: "1px",
              }}
            />
            {label}
          </div>
        ))}
      </div>
      {/* Engineering Challenges */}
      <div style={{ color: "#ce93d8", margin: "24px 0 12px" }}>
        Engineering Challenges & Solutions
      </div>
      {CHALLENGES.map((c, i) => (
        <div
          key={i}
          style={{
            maxWidth: "700px",
            marginBottom: "16px",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          {/* Challenge Title */}
          <div
            style={{
              padding: "8px 14px",
              background: "rgba(255,255,255,0.04)",
              color: "#29b6f6",
              fontSize: "13px",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            {i + 1}. {c.title}
          </div>

          <div
            style={{
              padding: "10px 14px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            {/* Problem */}
            <div>
              <span
                style={{
                  color: "#ff5f57",
                  fontSize: "11px",
                  letterSpacing: "0.5px",
                }}
              >
                PROBLEM
              </span>
              <div
                style={{
                  color: "rgba(255,255,255,0.60)",
                  fontSize: "12px",
                  marginTop: "3px",
                }}
              >
                {c.problem}
              </div>
            </div>

            {/* Solution */}
            <div>
              <span
                style={{
                  color: "#febc2e",
                  fontSize: "11px",
                  letterSpacing: "0.5px",
                }}
              >
                SOLUTION
              </span>
              <div
                style={{
                  color: "rgba(255,255,255,0.60)",
                  fontSize: "12px",
                  marginTop: "3px",
                }}
              >
                {c.solution}
              </div>
            </div>

            {/* Result */}
            <div>
              <span
                style={{
                  color: "#28c840",
                  fontSize: "11px",
                  letterSpacing: "0.5px",
                }}
              >
                RESULT
              </span>
              <div
                style={{
                  color: "rgba(255,255,255,0.60)",
                  fontSize: "12px",
                  marginTop: "3px",
                }}
              >
                {c.result}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TorkAIProject;

import React from "react";
import TorkAIProject from "./TorkAIProject";
import BotDetectionProject from "./BotDetectionProject";

const PROJECT_MAP = {
  "tork-ai": TorkAIProject,
  "bot-detection": BotDetectionProject,
};

const ProjectContainer = ({ projectKey }) => {
  const ProjectComponent = PROJECT_MAP[projectKey];

  if (!ProjectComponent) return (
    <div style={{ color: "#ff5f57", fontSize: "13px", marginTop: "10px" }}>
      Project not found.
    </div>
  );

  return (
    <div style={{
      marginTop: "10px",
      padding: "16px 20px",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: "8px",
      background: "rgba(255,255,255,0.02)",
    }}>
      <ProjectComponent />
    </div>
  );
};

export default ProjectContainer;
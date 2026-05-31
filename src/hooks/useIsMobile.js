// Replace the entire file content with this:
import { useState, useEffect } from "react";

const getDeviceTier = () => {
  if (typeof window === "undefined") return "desktop";
  const w = window.innerWidth;
  const hasTouch = "ontouchstart" in window;

  if (w < 768) return "mobile";                          // phones
  if (w <= 1024 || (hasTouch && w < 1200)) return "tablet"; // iPad Mini, iPad Air, iPad Pro portrait
  return "desktop";                                       // laptops, desktops
};

const useIsMobile = () => {
  const [tier, setTier] = useState(() => getDeviceTier());

  useEffect(() => {
    const check = () => setTier(getDeviceTier());
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Expose both for consumers that need granular control
  return {
    isMobile: tier === "mobile",
    isTablet: tier === "tablet",
    isDesktop: tier === "desktop",
    isMobileOrTablet: tier === "mobile" || tier === "tablet",
  };
};

export default useIsMobile;
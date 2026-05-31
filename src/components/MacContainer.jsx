import React, { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useScroll, useTexture } from "@react-three/drei";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

const MacContainer = ({ onEnterScreen }) => {
  let model = useGLTF("/mac.glb");
  let meshes = {};
  
  const phase = useRef("idle"); // idle → waiting → apple → fading → reveal → done
  const timer = useRef(0);
  const clockTimer = useRef(0);
  const enterPressed = useRef(false);
  const cameraAnimating = useRef(false);
  const camTarget = useRef(new THREE.Vector3(0, -6, 124)); // resting just in front of screen
  const postZoomTimer   = useRef(0);
  const postZoomStarted = useRef(false);
  let data = useScroll();


  const appleScreenTex = useMemo(() => {
    const SIZE = 1526;
    const canvas = document.createElement("canvas");
    canvas.width = SIZE;
    canvas.height = SIZE;
    const ctx = canvas.getContext("2d");

    // Black background — matches real Mac boot screen
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, SIZE, SIZE);

    const canvasTex = new THREE.CanvasTexture(canvas);

    const img = new Image();
    img.onload = () => {
      const LOGO_SIZE = 1800 * 0.09; // 10% of canvas = small, realistic size
      const x = (SIZE - LOGO_SIZE) / 2; // centered horizontally
      const y = (SIZE - LOGO_SIZE) / 2; // centered vertically
      ctx.drawImage(img, x, y, LOGO_SIZE, LOGO_SIZE);
      canvasTex.needsUpdate = true; // tell Three.js to re-upload to GPU
    };
    img.src = "/Apple_logo_white.png";

    return canvasTex;
  }, []);

  const blackTex = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 4; // tiny — no need for large canvas for solid black
    canvas.height = 4;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, 4, 4);
    return new THREE.CanvasTexture(canvas);
  }, []);

  const liveScreen = useMemo(() => {
    const W = 1920,
      H = 1200;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;

    function draw() {
      const now = new Date();
      // 24-hour format like real macOS
      const time = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      const dayName = now.toLocaleDateString([], { weekday: "long" });
      const dateStr = now.toLocaleDateString([], {
        month: "long",
        day: "numeric",
      });

      if (bg.complete) ctx.drawImage(bg, 0, 0, W, H);

      ctx.textAlign = "center";

      // ── Frosted glass pill behind date + time ──
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(W * 0.28, H * 0.08, W * 0.44, H * 0.36, 28);
      ctx.fillStyle = "rgba(255,255,255,0.06)"; // subtle glass tint
      ctx.fill();
      ctx.restore();

      // ── Date — "Wednesday, November 1" ──
      ctx.shadowColor = "rgba(0,0,0,0.45)";
      ctx.shadowBlur = 14;
      ctx.fillStyle = "rgba(255,255,255,0.82)";
      ctx.font = "300 54px 'Helvetica Neue', Helvetica, Arial, sans-serif";
      ctx.fillText(`${dayName}, ${dateStr}`, W / 2, H * 0.22);

      // ── Time — huge thin weight like macOS ──
      ctx.fillStyle = "rgba(255,255,255,0.96)";
      ctx.font = "100 240px 'Helvetica Neue', Helvetica, Arial, sans-serif";
      ctx.shadowBlur = 22;
      ctx.fillText(time, W / 2, H * 0.44);

      // ── Avatar circle ──
      const cx = W / 2;
      const avatarY = H * 0.74;
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.arc(cx, avatarY, 52, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255,255,255,0.55)";
      ctx.lineWidth = 3;
      ctx.stroke();

      // Simple person silhouette inside avatar
      ctx.fillStyle = "rgba(255,255,255,0.45)";
      ctx.beginPath();
      ctx.arc(cx, avatarY - 14, 17, 0, Math.PI * 2); // head
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx, avatarY + 30, 30, Math.PI, 0); // shoulders
      ctx.fill();

      // ── Name ──
      ctx.shadowColor = "rgba(0,0,0,0.5)";
      ctx.shadowBlur = 14;
      ctx.fillStyle = "rgba(255,255,255,0.96)";
      ctx.font = "400 54px 'Helvetica Neue', Helvetica, Arial, sans-serif";
      ctx.fillText("Parth Sunil Khairnar", cx, H * 0.85);
      // const A = 1100;
      ctx.fillText("Full Stack Developer", cx, H * 0.9);

      // ── Subtitle ──
      ctx.fillStyle = "rgba(255,255,255,0.50)";
      ctx.font = "300 36px 'Helvetica Neue', Helvetica, Arial, sans-serif";
      ctx.fillText("To Begin , Please Press Enter", cx, H * 0.95);

      texture.needsUpdate = true;
    }

    const bg = new Image();
    bg.onload = draw; // draw once bg is ready
    bg.src = "/mac-lock-background.avif";

    texture.userData.draw = draw; // store reference for live updates
    return texture;
  }, []);


  useEffect(() => {
    const onKey = (e) => {
      if (
        e.key === "Enter" &&
        phase.current === "done" && // only works after full sequence
        !enterPressed.current // fire only once
      ) {
        enterPressed.current = true;
        cameraAnimating.current = true;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey); // cleanup on unmount
  }, []);

  // data.el IS the ScrollControls scroll container — no querySelector needed
// Replace the entire onClick useEffect with this:


  model.scene.traverse((e) => {
    meshes[e.name] = e;
  });
  meshes.screen.rotation.x = THREE.MathUtils.degToRad(0);
  meshes.matte.material.map = liveScreen;
  meshes.matte.material.emissiveIntensity = 0;
  meshes.matte.material.metalness = 0;
  meshes.matte.material.roughness = 1;
  meshes.matte.material.transparent = true;
  meshes.matte.material.map = blackTex;

  

  useFrame((state, delta) => {
    meshes.screen.rotation.x = THREE.MathUtils.degToRad(180 - data.offset * 90);

    // Laptop is "fully open" when offset crosses 0.9
    if (data.offset > 0.9 && phase.current === "idle") {
      phase.current = "waiting";
      timer.current = 0;
    }

    if (phase.current === "waiting") {
      timer.current += delta;
      if (timer.current >= 1) {
        // 1s delay
        meshes.matte.material.map = appleScreenTex;
        meshes.matte.material.opacity = 1;
        meshes.matte.material.needsUpdate = true;
        phase.current = "apple";
        timer.current = 0;
      }
    }

    if (phase.current === "apple") {
      timer.current += delta;
      if (timer.current >= 3) {
        // hold 3s
        phase.current = "fading";
        timer.current = 0;
      }
    }

    if (phase.current === "fading") {
      timer.current += delta;
      const FADE_DURATION = 1.2; // seconds to fade out
      meshes.matte.material.opacity =
        1 - Math.min(timer.current / FADE_DURATION, 1);
      if (timer.current >= FADE_DURATION) {
        meshes.matte.material.map = liveScreen; // swap to mac-lock-background.avif
        meshes.matte.material.opacity = 0;
        meshes.matte.material.needsUpdate = true;
        phase.current = "reveal";
        timer.current = 0;
      }
    }

    if (phase.current === "reveal") {
      timer.current += delta;
      const FADE_DURATION = 1.2; // seconds to fade in mac-lock-background.avif
      meshes.matte.material.opacity = Math.min(
        timer.current / FADE_DURATION,
        1,
      );
      if (timer.current >= FADE_DURATION) {
        phase.current = "done";
      }
    }

    if (phase.current === "done") {
      clockTimer.current += delta;
      if (clockTimer.current >= 1) {
        clockTimer.current = 0;
        liveScreen.userData.draw(); // redraw canvas with updated time
      }
    }

    if (cameraAnimating.current) {
  // damp = frame-rate independent smooth lerp with ease-out
  // factor 3 = smooth cinematic pull, increase for snappier feel
  state.camera.position.x = THREE.MathUtils.damp(
    state.camera.position.x, camTarget.current.x, 3, delta
  );
  state.camera.position.y = THREE.MathUtils.damp(
    state.camera.position.y, camTarget.current.y, 3, delta
  );
  state.camera.position.z = THREE.MathUtils.damp(
    state.camera.position.z, camTarget.current.z, 3, delta
  );
  state.camera.updateProjectionMatrix();

  // Stop animating once close enough (avoids infinite micro-updates)
  if (Math.abs(state.camera.position.z - camTarget.current.z) < 0.05) {
    cameraAnimating.current = false;
  }
}

  // After camera animation finishes, wait 1s then open terminal
if (!cameraAnimating.current && enterPressed.current && !postZoomStarted.current) {
  postZoomStarted.current = true;
  postZoomTimer.current   = 0;
}
if (postZoomStarted.current && postZoomTimer.current < 1) {
  postZoomTimer.current += delta;
  if (postZoomTimer.current >= 1) {
    onEnterScreen?.();  // fire once — App.jsx handles the rest
  }
}

  });

  useEffect(() => {
  const onClick = () => {
    if (phase.current === "done" || enterPressed.current) return;

    // data is from useScroll() — data.el is the actual scrollable div
    // This is guaranteed to be correct, no DOM querying needed
    if (data.el) {
      data.el.scrollTo({
        top: data.el.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  window.addEventListener("click", onClick);
  return () => window.removeEventListener("click", onClick);
}, [data.el]); // depend on data.el so effect re-runs if ref changes


  return (
    <group position={[0, -10, 20]}>
      <primitive object={model.scene} />
    </group>
  );
};

export default MacContainer;

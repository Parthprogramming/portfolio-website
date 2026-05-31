import react , { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, ScrollControls } from "@react-three/drei";
import MacContainer from "./components/MacContainer";
import TerminalContainer from "./components/TerminalContainer";
import MobilePortfolio from "./components/MobilePortfolio";
import useIsMobile from "./hooks/useIsMobile";
import "./style.css";


const App = () => {
  const [showTerminal, setShowTerminal] = useState(false);
  const { isMobileOrTablet } = useIsMobile(); 
  if (isMobileOrTablet) {
    return <MobilePortfolio />;
  }
  return (
    <>
      <Canvas camera={{ fov: 10, position: [0, -10, 150] }}>
        <Environment
          files={[
            "https://dl.polyhaven.org/file/ph-assets/HDRIs/exr/4k/studio_small_09_4k.exr",
          ]}
        />
        <ScrollControls pages={3}>
          <MacContainer onEnterScreen={() => setShowTerminal(true)} />
        </ScrollControls>
      </Canvas>
 
      {showTerminal && <TerminalContainer />}
    </>
  );
};

export default App;

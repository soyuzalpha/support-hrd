"use client";

import { useBackground } from "@/hooks/use-backgrounds";
import Silk from "@/components/Silk";
import Beams from "@/components/Beams";
import ColorBends from "@/components/ColorBends";
import Aurora from "./Aurora";

export function DynamicBackground() {
  const { background } = useBackground();

  //   if (!background) return null;

  //   // HEX solid color
  //   if (background.startsWith("#")) {
  //     return <div className="absolute inset-0 -z-10" style={{ backgroundColor: background }} />;
  //   }

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {/* {background === "silk" && <Silk speed={10} scale={1} color="#F93827" noiseIntensity={1.7} rotation={0} />} */}

      {/* <Aurora colorStops={["#ffffff", "#FF94B4", "#FF3232"]} blend={0.5} amplitude={1.0} speed={0.5} /> */}
      <div
        className="
        absolute inset-0 
        pointer-events-none 
        backdrop-blur-2xl 
        bg-white/5 
        dark:bg-black/10 
        border-t border-white/10
      "
      />

      <Beams
        beamWidth={3}
        beamHeight={30}
        beamNumber={20}
        lightColor="#ffffff"
        speed={5}
        noiseIntensity={1.75}
        scale={0.2}
        rotation={30}
      />

      {/* {background === "colorbends" && (
        <ColorBends
          colors={["#ff5c7a", "#43ff88", "#023e8a"]}
          rotation={0}
          autoRotate={0}
          speed={0.2}
          scale={1}
          frequency={1}
          warpStrength={1}
          mouseInfluence={1}
          parallax={0.5}
          noise={0.08}
          transparent
        />
      )} */}
    </div>
  );
}

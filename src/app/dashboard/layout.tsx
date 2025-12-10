"use client";

import "../globals.css";
import { geist, inter, jetbrainsMono, literata, poppins } from "@/lib/fonts";
import React from "react";
import { DockMenu } from "@/components/DockMenu";
import { useAppContext } from "@/context/app-context";
import { Navbar } from "@/components/Navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { DynamicBackground } from "@/components/DyanamicBackgrounds";
import Beams from "@/components/Beams";
import Silk from "@/components/Silk";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { state } = useAppContext();
  const currentFont = state.ui?.font || "poppins";

  React.useEffect(() => {
    const map = {
      literata: literata.className,
      inter: inter.className,
      poppins: poppins.className,
      geist: geist.className,
      "jetbrains-mono": jetbrainsMono.className,
    };

    document.body.classList.remove(
      literata.className,
      poppins.className,
      jetbrainsMono.className,
      inter.className,
      geist.className
    );

    document.body.classList.add(map[currentFont]);
  }, [currentFont]);

  return (
    <div className={`antialiased ${poppins.variable}`}>
      {/* Beams Background Layer */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* <Silk speed={10} scale={1} color="#F93827" noiseIntensity={1.7} rotation={0} /> */}
        {/* <Silk speed={10} scale={1} color="#ffffff" noiseIntensity={1.7} rotation={0} /> */}
        <Beams
          beamWidth={3}
          beamHeight={30}
          beamNumber={20}
          lightColor="#F93827"
          speed={5}
          noiseIntensity={1.75}
          scale={0.2}
          rotation={30}
        />
      </div>

      {/* Glassmorphism Overlay Layer */}
      <div className="absolute inset-0 -z-5 backdrop-blur-lg bg-white/10" />

      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar transparent={true} />

          <main className="flex-1 overflow-y-auto">
            <div className="container mx-auto lg:h-[calc(100vh-10rem)] px-2 pt-2 pb-4">{children}</div>
          </main>

          <DockMenu />
        </div>
      </ThemeProvider>
    </div>
  );
}

// "use client";

// import "../globals.css";
// import { geist, inter, jetbrainsMono, literata, poppins } from "@/lib/fonts";
// import React from "react";
// import { DockMenu } from "@/components/DockMenu";
// import { useAppContext, useUser } from "@/context/app-context";
// import { Navbar } from "@/components/Navbar";
// import { ThemeProvider } from "@/components/theme-provider";
// import Beams from "@/components/Beams";
// import Silk from "@/components/Silk";
// import ColorBends from "@/components/ColorBends";

// export default function DashboardLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   const { state } = useAppContext();
//   const currentFont = state.ui?.font || "poppins";

//   React.useEffect(() => {
//     const map: Record<string, string> = {
//       literata: literata.className,
//       inter: inter.className,
//       poppins: poppins.className,
//       geist: geist.className,
//       "jetbrains-mono": jetbrainsMono.className,
//     };

//     document.body.classList.remove(
//       literata.className,
//       poppins.className,
//       jetbrainsMono.className,
//       inter.className,
//       geist.className
//     );
//     document.body.classList.add(map[currentFont]);
//   }, [currentFont]);

//   return (
//     <>
//       <div className={`antialiased ${poppins.variable}`}>
//         <div className="absolute inset-0 -z-10">
//           {/* <Silk speed={10} scale={1} color="#F93827" noiseIntensity={1.7} rotation={0} /> */}
//           {/* <Beams
//             beamWidth={3}
//             beamHeight={30}
//             beamNumber={20}
//             // lightColor="#F93827"
//             lightColor="#ffffff"
//             speed={5}
//             noiseIntensity={1.75}
//             scale={0.2}
//             rotation={30}
//           /> */}
//           {/* <ColorBends
//             colors={["#ff5c7a", "#43ff88", "#023e8a"]}
//             rotation={0}
//             autoRotate={0}
//             speed={0.2}
//             scale={1}
//             frequency={1}
//             warpStrength={1}
//             mouseInfluence={1}
//             parallax={0.5}
//             noise={0.08}
//             transparent
//           /> */}
//         </div>

//         <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
//           <div className="relative z-10 flex flex-col min-h-screen">
//             <Navbar />

//             <div className="flex-1 overflow-hidden">
//               <div className="container mx-auto lg:h-[calc(100vh-10rem)] overflow-y-auto px-2 pt-2 pb-4">
//                 {children}
//               </div>
//             </div>

//             <DockMenu />
//           </div>
//         </ThemeProvider>
//       </div>
//     </>
//   );
// }

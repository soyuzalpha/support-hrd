"use client";

import { Poppins } from "next/font/google";
import "./globals.css";
import ColorBends from "@/components/ColorBends";
import Head from "./head";

import { ThemeProvider } from "@/components/theme-provider";
import ProvidersReactQuery from "./providerQuery";
import { Toaster } from "sonner";
import { ToastStyles } from "@/components/ui/toast-styles";
import { AppContextProvider } from "@/context/app-context";
import { SessionProvider } from "next-auth/react";
import { useIsMobile } from "@/hooks/use-mobile";
import Beams from "@/components/Beams";

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Head />

      {/* ---------------------------------------------
          BODY — fix: remove overflow-hidden
      ----------------------------------------------*/}
      <body className={`${poppins.variable} antialiased relative min-h-screen`}>
        {/* Background ReactBits */}
        <div className="absolute inset-0 -z-10">
          <Beams
            beamWidth={2}
            beamHeight={30}
            beamNumber={20}
            // lightColor="#F93827"
            lightColor="#ffffff"
            speed={5}
            noiseIntensity={1.75}
            scale={0.2}
            rotation={30}
          />
          {/* <ColorBends
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
          /> */}
        </div>

        {/* Main Content */}
        <main className="relative">
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <SessionProvider>
              <ProvidersReactQuery>
                <AppContextProvider>
                  <div className="relative z-10">{children}</div>
                </AppContextProvider>

                <Toaster position={useIsMobile() ? "bottom-center" : "top-right"} />
                <ToastStyles />
              </ProvidersReactQuery>
            </SessionProvider>
          </ThemeProvider>
        </main>
      </body>
    </html>
  );
}

// "use client";

// import { Poppins } from "next/font/google";
// import "./globals.css";
// import Beams from "@/components/Beams";
// import Silk from "@/components/Silk";
// import Head from "./head";
// import { ThemeProvider } from "@/components/theme-provider";
// import ProvidersReactQuery from "./providerQuery";
// import { Toaster } from "sonner";
// import { ToastStyles } from "@/components/ui/toast-styles";
// import { AppContextProvider } from "@/context/app-context";
// import { SessionProvider } from "next-auth/react";
// import { useIsMobile } from "@/hooks/use-mobile";
// import { NavigationMenuDemo } from "@/components/NavigationMenu";
// import { ShaderGradient, ShaderGradientCanvas } from "@shadergradient/react";
// import DarkVeil from "@/components/DarkVeil";
// import ColorBends from "@/components/ColorBends";

// const poppins = Poppins({
//   variable: "--font-poppins",
//   weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
//   subsets: ["latin"],
// });

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en" suppressHydrationWarning>
//       <Head />
//       <body className={`${poppins.variable} antialiased relative min-h-screen`}>
//         <div className="absolute inset-0 -z-10">
//           <ColorBends
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
//           />
//           {/* <DarkVeil /> */}
//           {/* <ShaderGradientCanvas>
//             <ShaderGradient
//               cDistance={2}
//               color1="#ff5005"
//               color2="#dbba95"
//               color3="#dbba95"
//               grain="on"
//               envPreset="city"
//               reflection={0.4}
//               brightness={1.2}
//               uSpeed={0.4}
//             />
//           </ShaderGradientCanvas> */}
//           {/* <Silk speed={10} scale={1} color="#ffffff" noiseIntensity={1.5} rotation={0} /> */}
//           {/* <Beams
//             beamWidth={2}
//             beamHeight={30}
//             beamNumber={20}
//             lightColor="#F93827"
//             // lightColor="#ff5005"
//             speed={5}
//             noiseIntensity={1.75}
//             scale={0.2}
//             rotation={30}
//           /> */}
//         </div>

//         {/* Main content */}
//         <main className="relative z-10">
//           <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
//             <SessionProvider>
//               <ProvidersReactQuery>
//                 <AppContextProvider>{children}</AppContextProvider>
//                 <Toaster position={useIsMobile() ? "bottom-center" : "top-right"} />
//                 <ToastStyles />
//               </ProvidersReactQuery>
//             </SessionProvider>
//           </ThemeProvider>
//         </main>
//       </body>
//     </html>
//   );
// }

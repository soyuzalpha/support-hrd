import { JetBrains_Mono, Literata, Poppins, Inter, Geist, Geist_Mono, DM_Sans } from "next/font/google";

// Initialize fonts first in module scope
export const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
});

export const literata = Literata({
  variable: "--font-literata",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const dmsans = DM_Sans({
  variable: "--font-dmsans-sans",
  subsets: ["latin"],
});

// Then create the array with the initialized fonts
export const fonts = [
  {
    name: "Inter",
    font: inter,
    variable: "--font-inter",
    weights: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  },
  {
    name: "Poppins",
    font: poppins,
    variable: "--font-poppins",
    weights: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  },
  {
    name: "JetBrains Mono",
    font: jetbrainsMono,
    variable: "--font-jetbrains-mono",
    weights: ["100", "200", "300", "400", "500", "600", "700", "800"],
  },
  {
    name: "Literata",
    font: literata,
    variable: "--font-literata",
    weights: ["200", "300", "400", "500", "600", "700", "800"],
  },
  {
    name: "Geist",
    font: geist,
    variable: "--font-geist",
    weights: ["200", "300", "400", "500", "600", "700", "800"],
  },
  {
    name: "Geist Sans",
    font: geistSans,
    variable: "--font-geist-sans",
    weights: ["400"],
  },
  {
    name: "Geist Mono",
    font: geistMono,
    variable: "--font-geist-mono",
    weights: ["400"],
  },
  {
    name: "DM Sans",
    font: dmsans,
    variable: "--font-dmsans-sans",
    weights: ["400"],
  },
];

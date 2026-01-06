"use client";

import "./globals.css";
import Head from "./head";
import { ThemeProvider } from "@/components/theme-provider";
import ProvidersReactQuery from "./providerQuery";
import { Toaster } from "sonner";
import { ToastStyles } from "@/components/ui/toast-styles";
import { AppContextProvider } from "@/context/app-context";
import { SessionProvider } from "next-auth/react";
import { poppins } from "@/lib/fonts";
import { useIsMobile } from "@/hooks/use-mobile";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Head />

      <body className={`${poppins.className} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" disableTransitionOnChange>
          <SessionProvider>
            <ProvidersReactQuery>
              <AppContextProvider>
                <div className="relative min-h-screen overflow-x-hidden">
                  <div
                    className="absolute inset-0 -z-10"
                    style={{
                      backgroundColor: "#EEECE3",
                      backgroundImage: "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.35) 1px, transparent 1px)",
                      backgroundSize: "20px 20px",
                    }}
                  />
                  {children}
                </div>

                {/* <div className={`antialiased ${poppins.variable}`}>
                  <div
                    className="absolute inset-0 z-0"
                    style={{
                      background: "#EEECE3",
                      // background: "#FCF9EA",
                      backgroundImage: "radial-gradient(circle at 1px 1px, rgba(0, 0, 0, 0.35) 1px, transparent 0)",
                      backgroundSize: "20px 20px",
                    }}
                  />
                </div>

                {children} */}
              </AppContextProvider>
              <Toaster position={useIsMobile() ? "bottom-center" : "top-right"} />
              <ToastStyles />
            </ProvidersReactQuery>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

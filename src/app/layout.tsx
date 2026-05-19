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
import { SettingsProvider } from "@/context/settings-context";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Head />

      <body className={` antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" disableTransitionOnChange>
          <SessionProvider>
            <ProvidersReactQuery>
              <AppContextProvider>
                <div className="relative min-h-screen overflow-x-hidden ">
                  {/* <div
                    className="absolute inset-0 -z-10"
                    style={{
                      backgroundImage: `
      linear-gradient(rgba(0,0,0,0.035) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,0,0,0.035) 1px, transparent 1px)
    `,
                      backgroundSize: "32px 32px",

                      maskImage: "radial-gradient(circle at center, black 35%, transparent 85%)",
                      WebkitMaskImage: "radial-gradient(circle at center, black 35%, transparent 85%)",
                    }}
                  /> */}
                  <SettingsProvider>{children}</SettingsProvider>
                </div>
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

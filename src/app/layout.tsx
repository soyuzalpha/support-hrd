"use client";

import "./globals.css";
import Head from "./head";
import { ThemeProvider } from "@/components/theme-provider";
import ProvidersReactQuery from "./providerQuery";
import { Toaster } from "sonner";
import { ToastStyles } from "@/components/ui/toast-styles";
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
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SessionProvider>
            <ProvidersReactQuery>
              <SettingsProvider>{children}</SettingsProvider>
              <Toaster position={useIsMobile() ? "bottom-center" : "top-right"} />
              <ToastStyles />
            </ProvidersReactQuery>
          </SessionProvider>
        </ThemeProvider>
        {/* <ThemeProvider attribute="class" defaultTheme="light" disableTransitionOnChange>
          <SessionProvider>
            <ProvidersReactQuery>
              <AppContextProvider>
                <div className="relative min-h-screen overflow-x-hidden ">
                  <SettingsProvider>{children}</SettingsProvider>
                </div>
              </AppContextProvider>
              <Toaster position={useIsMobile() ? "bottom-center" : "top-right"} />
              <ToastStyles />
            </ProvidersReactQuery>
          </SessionProvider>
        </ThemeProvider> */}
      </body>
    </html>
  );
}

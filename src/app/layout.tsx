import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs'
import { ruRU } from "@clerk/localizations";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "MyPal",
  description: "Всегда есть с кем поговорить!",
};

const ibm = IBM_Plex_Mono({ subsets: ["cyrillic"], weight: "400" });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={ruRU}> 
      <html lang="ru" suppressHydrationWarning>
        <body className={cn("bg-primary-foreground", ibm.className)}>
          <ThemeProvider 
          attribute="class"
          defaultTheme="system" 
          enableSystem
          disableTransitionOnChange
          >
          {children}
          <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

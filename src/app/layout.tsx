import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { NavigationHeader } from "@/components/layout/NavigationHeader";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "StreamLive - Live Streaming Platform",
  description: "Professional live streaming platform for content creators",
  keywords: ["streaming", "live", "broadcast", "video", "content"],
  authors: [{ name: "StreamLive Team" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: "StreamLive - Live Streaming Platform",
    description: "Professional live streaming platform for content creators",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "StreamLive - Live Streaming Platform",
    description: "Professional live streaming platform for content creators",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className={`${inter.className} antialiased min-h-screen bg-background`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <NavigationHeader />
            <main className="flex-1">
              {children}
            </main>
            <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                  <div className="flex items-center space-x-4">
                    <p className="text-sm text-muted-foreground">
                      © 2024 StreamLive. All rights reserved.
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <a href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      Privacy Policy
                    </a>
                    <a href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      Terms of Service
                    </a>
                    <a href="/support" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      Support
                    </a>
                  </div>
                </div>
              </div>
            </footer>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
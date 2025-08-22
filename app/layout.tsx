import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/hooks/useAuth";
import { Toaster } from "sonner";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ChatGPT Clone - AI Chat Assistant",
  description: "A powerful AI chat assistant built with OpenAI GPT models, featuring real-time streaming, typing indicators, and subscription management.",
  keywords: ["AI", "ChatGPT", "OpenAI", "Chat", "Assistant", "GPT-4", "GPT-3.5"],
  authors: [{ name: "ChatGPT Clone Team" }],
  creator: "ChatGPT Clone",
  publisher: "ChatGPT Clone",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    title: "ChatGPT Clone - AI Chat Assistant",
    description: "A powerful AI chat assistant built with OpenAI GPT models",
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    siteName: "ChatGPT Clone",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ChatGPT Clone",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ChatGPT Clone - AI Chat Assistant",
    description: "A powerful AI chat assistant built with OpenAI GPT models",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geist.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            <Toaster 
              position="top-right"
              richColors
              closeButton
              duration={4000}
            />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

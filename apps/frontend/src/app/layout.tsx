import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "../components/ThemeProvider";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { AIAssistant } from "../components/AIAssistant";
import { CommandPaletteWrapper } from "../components/CommandPaletteWrapper";
import { GeometricBackground } from "../components/GeometricBackground";

export const metadata: Metadata = {
  title: "Project Aether | Shisank",
  description: "AI-Powered Personal Engineering Platform showcasing autonomous agent workflows, distributed consensus runtimes, and machine learning projects.",
  metadataBase: new URL("https://shisank.dev"),
  openGraph: {
    title: "Project Aether | Shisank",
    description: "AI-Powered Personal Engineering Platform showcasing autonomous agent workflows, distributed consensus runtimes, and machine learning projects.",
    type: "website",
    locale: "en_US",
    siteName: "Project Aether",
  },
  twitter: {
    card: "summary_large_image",
    title: "Project Aether | Shisank",
    description: "AI-Powered Personal Engineering Platform showcasing autonomous agent workflows, distributed consensus runtimes, and machine learning projects.",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased font-sans"
      style={ { colorScheme: "dark" } }
    >
      <body className="min-h-full flex flex-col bg-[#0a0a0c] text-white relative">
        <ThemeProvider>
          <GeometricBackground />
          <CommandPaletteWrapper />
          <Header />
          <main className="flex-1 flex flex-col pt-20 pb-16">
            {children}
          </main>
          <Footer />
          <AIAssistant />
        </ThemeProvider>
      </body>
    </html>
  );
}

import { Toaster } from "sonner";
import "./globals.css";
import { Roboto, Geist_Mono, Doto } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Footer from "@/components/Footer";

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-sans",
});
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

/*
  Doto is a variable font loaded via next/font/google.
  - "ROND" controls roundness (0 = straight, 100 = fully rounded).
  - By default next/font downloads & serves the font (no external requests at runtime).
  - The `variable` property creates a CSS custom property (--font-display) you can use anywhere.
  - Used as: font-family: var(--font-display);
  - Or in Tailwind: font-display (once added to @theme).
*/
const doto = Doto({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata = {
  title: "Trakio — Never miss a deal",
  description:
    "Track prices from any major e-commerce site with just a few clicks. Get instant alerts when prices drop below your target.",
};
export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${roboto.variable} ${geistMono.variable} ${doto.variable}`}
    >
      <body suppressHydrationWarning className="flex flex-col min-h-screen">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="flex-1">
            {children}
          </div>
          <Footer />
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}

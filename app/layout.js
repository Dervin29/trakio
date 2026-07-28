import { Toaster } from "sonner";
import "./globals.css";
import { Roboto, Geist_Mono } from "next/font/google";
import Footer from "@/components/Footer";

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-sans",
});
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
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
      className={`${roboto.variable} ${geistMono.variable}`}
    >
      <body suppressHydrationWarning className="flex flex-col min-h-screen">
        <div className="flex-1">
          {children}
        </div>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}

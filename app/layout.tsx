import type { Metadata } from "next";
import { Figtree, Fraunces, IBM_Plex_Mono } from "next/font/google";
import { AppFrame } from "@/components/app-frame";
import { getHandbook, navigation, numberedChapters } from "@/lib/handbook";
import "./globals.css";

const sans = Figtree({ subsets: ["latin"], variable: "--font-sans" });
const serif = Fraunces({ subsets: ["latin"], variable: "--font-serif" });
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: {
    default: "Nest Learn",
    template: "%s · Nest Learn",
  },
  description: "A self-study handbook for frontend developers learning backend development.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const book = getHandbook();

  return (
    <html lang="en" className={`${sans.variable} ${serif.variable} ${mono.variable}`}>
      <body>
        <AppFrame groups={navigation(book)} trackedSlugs={numberedChapters(book).map((chapter) => chapter.slug)}>
          {children}
        </AppFrame>
      </body>
    </html>
  );
}

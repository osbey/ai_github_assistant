import "./globals.css";
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
});
const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${plexMono.variable} ${plexSans.variable}`}
    >
      <body
        suppressHydrationWarning
        className="font-sans bg-(--ink) text-(--text) antialiased"
      >
        {children}
      </body>
    </html>
  );
}

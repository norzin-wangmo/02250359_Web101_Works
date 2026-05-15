import "./globals.css";
import { Providers } from "./providers";

export const metadata = {
  title: "TikTok Clone",
  description: "A TikTok clone built with Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
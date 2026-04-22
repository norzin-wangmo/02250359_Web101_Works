import { AuthProvider } from "@/contexts/authContext";
import "./globals.css";

export const metadata = {
  title: "TikTok Clone",
  description: "TikTok frontend connected to backend",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
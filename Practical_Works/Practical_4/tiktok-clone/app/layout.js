import "./globals.css";

export const metadata = {
  title: "TikTok Clone",
  description: "Practical 4 frontend backend connection",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
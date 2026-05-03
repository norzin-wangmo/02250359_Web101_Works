"use client";

import { useState } from "react";
import AuthModal from "../components/auth/AuthModal";

export default function RootLayout({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <html>
      <body>
        <button onClick={() => setOpen(true)}>Login</button>
        <AuthModal isOpen={open} onClose={() => setOpen(false)} />

        {children}
      </body>
    </html>
  );
}
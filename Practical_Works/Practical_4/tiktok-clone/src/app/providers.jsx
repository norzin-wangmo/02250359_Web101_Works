"use client";

import { Toaster } from "react-hot-toast";
import { AuthProvider } from "../contexts/authContext";
import MainLayout from "../components/layout/MainLayout";

export function Providers({ children }) {
  return (
    <AuthProvider>
      <MainLayout>{children}</MainLayout>
      <Toaster position="top-center" />
    </AuthProvider>
  );
}

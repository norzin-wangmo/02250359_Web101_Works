"use client";

import { useState } from "react";
import Link from "next/link";
import AuthModal from "../auth/AuthModal";
import { useAuth } from "../../contexts/authContext";

export default function MainLayout({ children }) {
  const [authOpen, setAuthOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Header */}
      <nav className="bg-black text-white p-4 flex justify-between items-center">
        <div className="flex gap-6">
          <Link href="/" className="font-bold text-xl hover:text-gray-300">
            TikTok
          </Link>
          {user && (
            <>
              <Link href="/following" className="hover:text-gray-300">
                Following
              </Link>
              <Link href="/explore-users" className="hover:text-gray-300">
                Explore
              </Link>
              <Link href="/upload" className="hover:text-gray-300">
                Upload
              </Link>
              <Link href={`/profile/${user.id}`} className="hover:text-gray-300">
                Profile
              </Link>
            </>
          )}
        </div>

        <div className="flex gap-3">
          {user ? (
            <>
              <span className="text-sm">{user.email}</span>
              <button
                onClick={() => {
                  logout();
                }}
                className="bg-red-600 px-4 py-1 rounded hover:bg-red-700"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => setAuthOpen(true)}
              className="bg-blue-600 px-4 py-1 rounded hover:bg-blue-700"
            >
              Login/Register
            </button>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 container mx-auto p-4">{children}</main>

      {/* Auth Modal */}
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
}

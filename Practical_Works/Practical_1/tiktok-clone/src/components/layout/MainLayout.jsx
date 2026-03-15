"use client"

import Link from "next/link"

export default function MainLayout({ children }) {
  return (
    <div className="flex min-h-screen">

      {/* Sidebar */}
      <div className="w-60 bg-black text-white p-6 space-y-4">

        <h1 className="text-3xl font-bold text-pink-500">
          TikTok
        </h1>

        <nav className="flex flex-col space-y-3">

          <Link href="/">For You</Link>
          <Link href="/following">Following</Link>
          <Link href="/explore">Explore</Link>
          <Link href="/live">Live</Link>
          <Link href="/upload">Upload</Link>
          <Link href="/profile">Profile</Link>

        </nav>

        <div className="pt-6 border-t border-gray-700">

          <Link href="/login" className="block">
            Login
          </Link>

          <Link href="/signup" className="block">
            Signup
          </Link>

        </div>

      </div>

      {/* Content */}

      <div className="flex-1 bg-gray-100 p-10">
        {children}
      </div>

    </div>
  )
}
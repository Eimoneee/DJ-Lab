"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "🏠" },
  { href: "/curriculum", label: "Curriculum", icon: "📚" },
  { href: "/practice", label: "Practice", icon: "🎧" },
  { href: "/lab", label: "Lab", icon: "🔬" },
  { href: "/artists", label: "Artists", icon: "🎵" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <>
      {/* Desktop sidebar */}
      <nav className="hidden md:flex fixed left-0 top-0 h-full w-56 flex-col border-r border-gray-800 bg-gray-950 p-4 z-40">
        <Link href="/dashboard" className="mb-8 flex items-center gap-2 px-2">
          <span className="text-2xl">🎛️</span>
          <span className="text-lg font-bold text-white">DJ Lab</span>
        </Link>
        <div className="flex flex-1 flex-col gap-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? "bg-brand-600/20 text-brand-400 font-medium"
                    : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
        <button
          onClick={handleSignOut}
          className="mt-auto flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-500 transition-colors hover:bg-gray-800 hover:text-gray-300"
        >
          <span>🚪</span>
          <span>Sign Out</span>
        </button>
      </nav>

      {/* Mobile bottom bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-gray-800 bg-gray-950 px-2 py-2">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 rounded-lg px-3 py-1 text-xs transition-colors ${
                isActive
                  ? "text-brand-400"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex flex-col items-center gap-0.5 rounded-lg px-3 py-1 text-xs text-gray-500 hover:text-gray-300"
        >
          <span className="text-lg">⚙️</span>
          <span>More</span>
        </button>
      </nav>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/50"
          onClick={() => setMenuOpen(false)}
        >
          <div
            className="absolute bottom-16 right-4 rounded-xl border border-gray-800 bg-gray-900 p-2 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-gray-300 hover:bg-gray-800"
            >
              <span>🚪</span>
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}

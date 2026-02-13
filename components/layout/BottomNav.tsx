"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, Map, ScrollText } from "lucide-react";

const navItems = [
  { href: "/dashboard", icon: Shield, label: "ステータス" },
  { href: "/roadmap", icon: Map, label: "冒険マップ" },
  { href: "/log", icon: ScrollText, label: "冒険ログ" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-surface border-t border-border">
      <div className="max-w-lg mx-auto flex">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 text-xs transition-colors ${
                isActive
                  ? "text-primary font-bold"
                  : "text-text-sub hover:text-text"
              }`}
            >
              <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

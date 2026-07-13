"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { navItems } from "@/lib/constants";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-60 flex-col bg-gray-900 text-gray-300">
      <div className="flex h-14 items-center px-5 border-b border-gray-800">
        <Link href="/tasks" className="text-lg font-bold text-white tracking-tight">
          DayLog
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/tasks" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-gray-800 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              )}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-gray-800 px-3 py-3">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
        >
          <LogOut size={18} />
          退出登录
        </button>
      </div>
    </aside>
  );
}

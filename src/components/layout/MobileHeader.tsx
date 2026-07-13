"use client";

import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Sidebar } from "./Sidebar";

export function MobileHeader() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="flex h-14 items-center justify-between border-b bg-white px-4 lg:hidden">
        <span className="text-lg font-bold text-gray-900">DayLog</span>
        <button
          onClick={() => setOpen(!open)}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/30 lg:hidden"
            onClick={() => setOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 w-60 lg:hidden">
            <Sidebar />
          </div>
        </>
      )}
    </>
  );
}

"use client";
import { signOut } from "next-auth/react";

export default function LogoutButton({ className }: { className?: string }) {
  return (
    <button 
      onClick={() => signOut({ callbackUrl: "/" })}
      className={className || "w-full text-gray-400 hover:text-white text-xs tracking-widest uppercase transition-colors border border-gray-800 hover:border-gray-600 bg-black/50 hover:bg-gray-900 px-4 py-2 rounded-sm"}
    >
      LOGOUT
    </button>
  );
}

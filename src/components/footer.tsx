"use client";

import { HeartIcon } from "@/src/components/icons";

export const Footer = () => {
  return (
    <footer className="w-full grid place-items-center gap-2 py-4 mt-8 text-gray-900">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-gray-700">Made with</span>
        <HeartIcon className="fill-red-500" size={18} />
        <span className="text-gray-700">by</span>
        <span className="text-gray-900 font-semibold">Exit</span>
      </div>

      <div className="text-xs text-gray-500">
        © {new Date().getFullYear()} Outline Admin
      </div>
    </footer>
  );
};

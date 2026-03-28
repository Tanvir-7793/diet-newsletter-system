"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full py-6 px-4 border-t bg-white/95 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60 border-slate-200">
      <div className="container mx-auto text-center">
        <p className="text-sm text-slate-600">
          Design and developed by{" "}
          <a 
            href="https://www.linkedin.com/in/tanvir-mujawar-7573012aa/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            Tanvir Mujawar
          </a>
        </p>
      </div>
    </footer>
  );
}

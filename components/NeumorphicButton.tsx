"use client";

import Link from "next/link";
import { ReactNode } from "react";

interface NeumorphicButtonProps {
  href: string;
  children: ReactNode;
  className?: string;
}

export const NeumorphicButton = ({ href, children, className = "" }: NeumorphicButtonProps) => {
  return (
    <Link
      href={href}
      className={`inline-block px-6 py-3 rounded-xl bg-white text-neutral-800 font-medium transition-all duration-200 hover:shadow-[0_8px_16px_rgba(0,0,0,0.12)] active:scale-95 ${className} neumorphic`}
    >
      {children}
    </Link>
  );
};

/*
  The "neumorphic" utility class is defined in globals.css:
  .neumorphic {
    box-shadow: 8px 8px 16px rgba(0,0,0,0.06), -8px -8px 16px rgba(255,255,255,0.7);
  }
*/

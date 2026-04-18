"use client";

import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
}

export const GlassCard = ({ children, className = "" }: GlassCardProps) => {
  return (
    <div className={`glass rounded-xl p-6 ${className}`}>
      {children}
    </div>
  );
};

/*
  The .glass utility is defined in globals.css and provides a semi‑transparent
  background with backdrop‑filter blur, suitable for the Light Neumorphic aesthetic.
*/

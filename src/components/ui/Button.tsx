"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";
import { Spinner } from "./Spinner";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  children: ReactNode;
}

const variantMap = {
  primary:
    "bg-black text-white hover:bg-zinc-800 border border-black focus:ring-2 focus:ring-black focus:ring-offset-2",
  secondary:
    "bg-white text-black hover:bg-zinc-100 border border-zinc-300 focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2",
  danger:
    "bg-red-600 text-white hover:bg-red-700 border border-red-600 focus:ring-2 focus:ring-red-500 focus:ring-offset-2",
  ghost:
    "bg-transparent text-zinc-700 hover:bg-zinc-100 border border-transparent focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2",
};

const sizeMap = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  children,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2 rounded-md font-medium
        transition-colors duration-150 outline-none
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantMap[variant]}
        ${sizeMap[size]}
        ${className}
      `}
      {...props}
    >
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  );
}

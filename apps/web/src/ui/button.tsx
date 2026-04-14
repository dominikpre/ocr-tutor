import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md";

type ButtonClassNameOptions = {
  className?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  ButtonClassNameOptions;

const variantStyles: Record<ButtonVariant, string> = {
  primary: "border-black bg-black text-white hover:bg-[#333333]",
  secondary: "bg-white text-foreground hover:bg-[color:var(--surface-muted)]",
  ghost: "border-transparent bg-transparent text-foreground hover:bg-[color:var(--surface-muted)]",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-sm",
};

export function buttonClassName({
  className,
  variant = "primary",
  size = "md",
  fullWidth = false,
}: ButtonClassNameOptions = {}) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-md border border-border font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#999999] disabled:pointer-events-none disabled:opacity-50",
    variantStyles[variant],
    sizeStyles[size],
    fullWidth && "w-full",
    className,
  );
}

export function Button({
  className,
  variant,
  size,
  fullWidth,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClassName({ className, variant, size, fullWidth })}
      {...props}
    />
  );
}

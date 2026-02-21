import type { ComponentPropsWithoutRef } from "react";

type ButtonVariant = "primary" | "secondary" | "outline";

interface ButtonProps extends ComponentPropsWithoutRef<"a"> {
  variant?: ButtonVariant;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-linear-to-br from-dark-blue to-bright-blue text-white hover:opacity-90",
  secondary:
    "bg-white text-bright-blue border-2 border-bright-blue hover:bg-blue-50",
  outline:
    "bg-transparent text-white border-2 border-white hover:bg-white/10",
};

export default function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <a
      className={`inline-flex items-center justify-center px-8 py-4 rounded-lg font-bold text-base transition-all cursor-pointer ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </a>
  );
}

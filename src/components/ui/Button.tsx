// Reusable button with primary, secondary, and ghost variants; sm/md/lg sizes; icon slot; loading state.
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: ReactNode;
}

const variantStyles: Record<string, string> = {
  primary:
    "bg-primary-500 text-brand-warm-white hover:bg-primary-600 active:bg-primary-700 shadow-lg shadow-primary-500/20 hover:shadow-primary-500/30",
  secondary:
    "border border-brand-fence text-brand-warm-white hover:bg-brand-risen active:bg-brand-clay",
  ghost:
    "text-brand-muted hover:text-brand-warm-white hover:bg-brand-risen",
};

const sizeStyles: Record<string, string> = {
  sm: "h-8 px-3 text-xs gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2.5",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", loading = false, icon, className = "", children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`
          inline-flex items-center justify-center rounded-lg font-body font-medium
          transition-all duration-200
          disabled:opacity-40 disabled:pointer-events-none
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-pitch
          ${variantStyles[variant]} ${sizeStyles[size]} ${className}
        `}
        {...props}
      >
        {loading ? (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : icon ? (
          <span className="flex-shrink-0">{icon}</span>
        ) : null}
        {children && <span>{children}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;

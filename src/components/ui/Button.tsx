// Reusable button component with primary and secondary variants.
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export default function Button({ variant = "primary", className = "", children, ...props }: ButtonProps) {
  const base = variant === "primary" ? "bg-primary-600 text-white hover:bg-primary-700" : "border hover:bg-gray-50";
  return (
    <button className={`px-4 py-2 rounded ${base} disabled:opacity-50 ${className}`} {...props}>
      {children}
    </button>
  );
}

export default function Button({
  children,
  isLoading = false,
  onClick = () => {},
  type = "button",
  className = "",
  disabled = false,
}: {
  children: React.ReactNode;
  isLoading?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
  className?: string;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      type={type}
      disabled={isLoading || disabled}
      className={`w-full max-w-xs bg-primary hover:bg-primary-dark text-white font-medium px-5 py-2 transition-colors shadow-soft disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed ${className}`}>
      {isLoading ? "Cargando..." : children}
    </button>
  );
}

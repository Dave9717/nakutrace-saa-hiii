import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function IconBox({
  icon: Icon,
  size = "md",
  variant = "primary",
  className,
}: {
  icon: LucideIcon;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "destructive";
  className?: string;
}) {
  const sizeClasses = {
    sm: "h-8 w-8 rounded [&>svg]:h-4 [&>svg]:w-4",
    md: "h-10 w-10 rounded-md [&>svg]:h-5 [&>svg]:w-5",
    lg: "h-12 w-12 rounded-lg [&>svg]:h-6 [&>svg]:w-6",
  };
  const variantClasses = {
    primary: "bg-primary/15 text-primary",
    destructive: "bg-destructive/15 text-destructive",
  };

  return (
    <div
      className={cn(
        "flex items-center justify-center",
        sizeClasses[size],
        variantClasses[variant],
        className,
      )}
    >
      <Icon />
    </div>
  );
}

import type { HTMLAttributes, JSX } from "react";
import { cn } from "@/lib/utils";

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "secondary" | "outline" | "success" | "warning" | "destructive";
};

const variantClasses: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default: "bg-primary text-primary-foreground",
  secondary: "bg-secondary text-secondary-foreground",
  outline: "border border-input bg-background text-foreground",
  success: "bg-emerald-600 text-white",
  warning: "bg-amber-500 text-black",
  destructive: "bg-destructive text-destructive-foreground"
};

export function Badge({ className, variant = "secondary", ...props }: BadgeProps): JSX.Element {
  return <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", variantClasses[variant], className)} {...props} />;
}

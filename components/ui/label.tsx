import type { JSX, LabelHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type LabelProps = LabelHTMLAttributes<HTMLLabelElement>;

export function Label({ className, ...props }: LabelProps): JSX.Element {
  return <label className={cn("text-sm font-medium leading-none", className)} {...props} />;
}

import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?:
    | "default"
    | "secondary"
    | "destructive"
    | "outline"
    | "emerald"
    | "amber"
    | "sky";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default:
      "border-transparent bg-slate-900 text-white hover:bg-slate-900/80 dark:bg-slate-50 dark:text-slate-900",
    secondary:
      "border-transparent bg-slate-100 text-slate-800 hover:bg-slate-200/80 dark:bg-slate-800 dark:text-slate-200",
    destructive:
      "border-transparent bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400",
    outline:
      "text-slate-700 border-slate-200 dark:text-slate-300 dark:border-slate-800",
    emerald:
      "border-emerald-200 bg-emerald-100 text-emerald-800 font-bold dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300",
    amber:
      "border-amber-200 bg-amber-100 text-amber-800 font-semibold dark:border-amber-800 dark:bg-amber-950/60 dark:text-amber-300",
    sky:
      "border-sky-200 bg-sky-100 text-sky-800 font-semibold dark:border-sky-800 dark:bg-sky-950/60 dark:text-sky-300",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };

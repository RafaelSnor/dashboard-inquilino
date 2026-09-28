import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  prefixLabel?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, prefixLabel, ...props }, ref) => {
    if (prefixLabel) {
      return (
        <div className="relative flex items-center w-full">
          <span className="absolute left-3 text-xs font-semibold text-slate-400 select-none pointer-events-none">
            {prefixLabel}
          </span>
          <input
            type={type}
            className={cn(
              "flex h-9 w-full rounded-md border border-slate-300 bg-white pl-8 pr-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100",
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
      );
    }

    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-slate-300 bg-white px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onCheckedChange?: (checked: boolean) => void;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, onCheckedChange, onChange, ...props }, ref) => {
    return (
      <label className="relative inline-flex items-center cursor-pointer select-none">
        <input
          type="checkbox"
          ref={ref}
          checked={checked}
          onChange={(e) => {
            onChange?.(e);
            onCheckedChange?.(e.target.checked);
          }}
          className="peer sr-only"
          {...props}
        />
        <div
          className={cn(
            "h-5 w-5 shrink-0 rounded-md border border-slate-300 transition-all flex items-center justify-center peer-focus-visible:ring-2 peer-focus-visible:ring-emerald-500 peer-focus-visible:ring-offset-2 peer-checked:bg-emerald-600 peer-checked:border-emerald-600 dark:border-slate-700 dark:peer-checked:bg-emerald-500",
            className
          )}
        >
          {checked && (
            <Check className="h-3.5 w-3.5 stroke-[3] text-white animate-in zoom-in-75 duration-100" />
          )}
        </div>
      </label>
    );
  }
);
Checkbox.displayName = "Checkbox";

export { Checkbox };

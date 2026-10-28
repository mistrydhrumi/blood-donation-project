import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  prefixElement?: React.ReactNode;
  suffixElement?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, prefixElement, suffixElement, ...props }, ref) => {
    if (prefixElement || suffixElement) {
      return (
        <div
          className={cn(
            "flex h-12 w-full items-center rounded-xl border bg-white shadow-xs transition-all overflow-hidden",
            error
              ? "border-red-500 ring-2 ring-red-100"
              : "border-gray-200 hover:border-gray-300 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-500/20"
          )}
        >
          {prefixElement && <div className="flex items-center h-full shrink-0">{prefixElement}</div>}
          <input
            type={type}
            className={cn(
              "w-full h-full px-3.5 text-sm md:text-base text-gray-900 placeholder:text-gray-400 bg-transparent outline-none disabled:cursor-not-allowed disabled:opacity-50",
              className
            )}
            ref={ref}
            {...props}
          />
          {suffixElement && <div className="flex items-center h-full shrink-0 pr-3.5">{suffixElement}</div>}
        </div>
      );
    }

    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm md:text-base text-gray-900 shadow-xs transition-all placeholder:text-gray-400 focus-visible:outline-none focus-visible:border-red-500 focus-visible:ring-2 focus-visible:ring-red-500/20 disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-red-500 ring-2 ring-red-100",
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

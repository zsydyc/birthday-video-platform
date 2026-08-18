import { cn } from "@/lib/utils";
import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";

const baseClasses =
  "w-full rounded-xl border-2 border-[#F5EEE6] bg-white px-4 py-3 text-[#2D2235] placeholder:text-[#8B7DA0] transition-colors focus:border-[#FF6B8A] focus:outline-none disabled:opacity-50";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input ref={ref} className={cn(baseClasses, className)} {...props} />
  )
);
Input.displayName = "Input";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea ref={ref} rows={4} className={cn(baseClasses, "resize-none", className)} {...props} />
  )
);
Textarea.displayName = "Textarea";

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export function Label({ required, className, children, ...props }: LabelProps) {
  return (
    <label className={cn("block text-sm font-semibold text-[#2D2235] mb-1", className)} {...props}>
      {children}
      {required && <span className="ml-1 text-[#FF6B8A]">*</span>}
    </label>
  );
}

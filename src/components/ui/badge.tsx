import { cn } from "@/lib/utils";

type BadgeVariant = "coral" | "yellow" | "sky" | "mint" | "ghost";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  coral:  "bg-[#FF6B8A]/15 text-[#E84D6F]",
  yellow: "bg-[#FFCF56]/25 text-[#9B7200]",
  sky:    "bg-[#60C8FF]/20 text-[#0A7AB5]",
  mint:   "bg-[#6ECFAF]/20 text-[#2A8A6E]",
  ghost:  "bg-[#2D2235]/8 text-[#5A4E6A]",
};

export function Badge({ variant = "coral", className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-0.5 text-xs font-semibold tracking-wide",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

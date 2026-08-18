import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export function Card({ hover, className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-white shadow-sm border border-white/60",
        hover && "transition-transform duration-200 hover:-translate-y-1 hover:shadow-md cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-6", className)} {...props}>
      {children}
    </div>
  );
}

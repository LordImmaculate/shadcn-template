import { cn } from "@/lib/utils";

export default function NumberBlock({
  number,
  label,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  number: number;
  label: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        className,
        "flex flex-col bg-background border border-accent p-4 m-4 rounded-xl text-center"
      )}
      {...props}
    >
      <span className="text-2xl font-bold">{number}</span>
      {label}
    </div>
  );
}

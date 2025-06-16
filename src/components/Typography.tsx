import { cn } from "@/lib/utils";

export function H1({
  className,
  ...delegated
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1 className={cn("text-3xl font-semibold", className)} {...delegated} />
  );
}
export function H2({
  className,
  ...delegated
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2 className={cn("text-xl font-semibold", className)} {...delegated} />
  );
}

export function H3({
  className,
  ...delegated
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-lg", className)} {...delegated} />;
}

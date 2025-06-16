import { H1 } from "@/components/Typography";
import { cn } from "@/lib/utils";

import logo from "@/assets/logo.png?url";

export function IdCard({
  children,
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className=" min-w-[240px] shadow-lg bg-orange-50 border border-red-500 border-t-8 p-4 space-y-4">
      <div className={cn("flex flex-row justify-center", className)}>
        <img
          alt="A pelican doctor writing up medical records."
          className="bg-red-50 border border-red-100 rounded-full"
          height={64}
          src={logo}
          width={64}
        />
        <H1 className="p-4">Pelican</H1>
      </div>
      {children}
    </div>
  );
}

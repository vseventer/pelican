import { H2 } from "@/components/Typography";

import logo from "@/assets/logo.png?url";

export function IdCard() {
  return (
    <div className="min-w-[240px] shadow-lg bg-orange-50 border border-red-500 border-t-8 p-4 flex flex-row justify-center">
      <img
        alt="A pelican doctor writing up medical records."
        className="bg-red-50 border border-red-100 rounded-full"
        height={64}
        src={logo}
        width={64}
      />
      <H2 className="p-4">Pelican</H2>
    </div>
  );
}

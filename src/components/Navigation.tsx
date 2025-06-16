import logo from "@/assets/logo.png?url";

function IdCard() {
  return (
    <div className="flex flex-row bg-orange-50 border border-red-500 border-t-8 p-2 w-[240px]">
      <img
        alt="A pelican doctor writing up medical records."
        className="bg-red-50 border border-red-100 rounded-full"
        height={64}
        src={logo}
        width={64}
      />
      <h1 className="p-4 text-3xl font-semibold">Pelican</h1>
    </div>
  );
}

export function Footer() {
  return <footer>footer</footer>;
}

export function Header() {
  return (
    <header className="container flex flex-wrap">
      <IdCard />
      <hr />
    </header>
  );
}

export function Sidebar() {
  return <aside></aside>;
}

import { Link } from "@tanstack/react-router";

import { IdCard } from "@/components/IdCard";
import { H3 } from "@/components/Typography";

export function Footer() {
  return (
    <footer className="p-4 text-center text-gray-300">
      Pelican is not a real application and Dr. Pelican Ph.D., unfortunately,
      does not exist either.
    </footer>
  );
}

export function Header() {
  return (
    <header className="container flex flex-wrap my-2">
      <IdCard />
      <hr />
    </header>
  );
}

function Pet({ data }) {
  return (
    <Link to="/pets/$petId" params={{ petId: data.id }}>
      {data.name}
    </Link>
  );
}

function PetList() {
  const pets = [];

  const inner =
    pets.length > 0 ? (
      <>
        <H3>Your Pets</H3>
        <hr />
        <ul>
          {pets.map((pet) => (
            <li key={pet.id}>
              <Pet key={pet.id} data={pet} />
            </li>
          ))}
        </ul>
      </>
    ) : null;

  return (
    <div className="space-y-2">
      {inner}
      <hr />
      <Link to="/new">Add a New Pet</Link>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside>
      <PetList />
    </aside>
  );
}

import { Suspense, use } from "react";

import { IdCard } from "@/components/IdCard";
import { Link } from "@/components/Link";
import { H3 } from "@/components/Typography";
import { fetchPetList } from "@/lib/hooks";
import { useUserId } from "./UserIntercept";

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

function PetList({ promise }) {
  const pets = use(promise);

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
  const userId = useUserId();
  return (
    <aside className="space-y-2">
      <Suspense fallback="Gathering your pets">
        <PetList promise={fetchPetList({ id: userId })} />
      </Suspense>
      <hr />
      <Link search={{ user: null }} to="/">
        Logout
      </Link>
    </aside>
  );
}

import { Suspense, use } from "react";

import { IdCard } from "@/components/IdCard";
import { Link } from "@/components/Link";
import { H3 } from "@/components/Typography";
import { useUserId } from "@/components/UserIntercept";
import type { Pet, User } from "@/db/schema";
import { USER_ADMIN } from "@/lib/constants";
import { fetchPetList } from "@/lib/hooks";

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
    <header className="container flex flex-wrap">
      <IdCard />
      <hr />
    </header>
  );
}

function Pet({ data }: { data: Pet }) {
  return (
    <Link to="/pets/$petId" params={{ petId: String(data.id) }}>
      {data.name}
    </Link>
  );
}

function PetList({ promise }: { promise: Promise<Pet[]> }) {
  const userId = useUserId();
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
      {userId === USER_ADMIN ? null : <Link to="/new">Add a New Pet</Link>}
    </div>
  );
}

export function Sidebar() {
  const userId = useUserId() as User["id"];
  return (
    <aside className="space-y-2">
      <Suspense fallback="Gathering your pets">
        <PetList promise={fetchPetList(userId)} />
      </Suspense>
      <hr />
      <Link search={() => ({})} to="/">
        Logout
      </Link>
    </aside>
  );
}

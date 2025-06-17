import {
  createFileRoute,
  notFound,
  useLoaderData,
} from "@tanstack/react-router";

import { DateTime } from "@/components/DateTime";
import { H1, H2 } from "@/components/Typography";
import { useUserId } from "@/components/UserIntercept";
import type { AllergyRecord, Pet } from "@/db/schema";
import { fetchPet } from "@/lib/hooks";
import { USER_ADMIN } from "@/lib/constants";

export const Route = createFileRoute("/pets/$petId")({
  component: RouteComponent,
  loader: async ({ location, params }) => {
    try {
      const pet = await fetchPet(params.petId, location.search.user);
      return pet;
    } catch {
      throw notFound();
    }
  },
  notFoundComponent: () => "Did your pet escape? We could not find it.",
});

function Allergy({ data }: { data: AllergyRecord }) {
  return (
    <>
      <strong>{data.name}</strong>
      {data.reaction ? (
        <>
          <br />
          Reactions: {data.reaction}{" "}
          {data.severity ? <em>({data.severity})</em> : null}
        </>
      ) : null}
    </>
  );
}

function Allergies({ data }: { data: Pet["allergies"] }) {
  const inner =
    data.length > 0 ? (
      <ul>
        {data.map((allergy) => (
          <li key={allergy.id}>
            <Allergy data={allergy} />
          </li>
        ))}
      </ul>
    ) : (
      <p>
        <em>None</em>
      </p>
    );
  return (
    <>
      <H2>Allergies</H2>
      {inner}
      <button>Add Allergy</button>
    </>
  );
}

function Vaccines({ data }: { data: Pet["vaccines"] }) {
  const inner =
    data.length > 0 ? (
      <ul className="space-y-2">
        {data.map((vaccine) => (
          <li key={vaccine.id}>
            <DateTime
              className="text-gray-400 text-sm"
              time={vaccine.dateOfAdministration}
            />
            <br />
            {vaccine.name}
          </li>
        ))}
      </ul>
    ) : (
      <p>
        <em>None</em>
      </p>
    );
  return (
    <>
      <H2>Vaccine History</H2>
      {inner}
      <button>Add Vaccine</button>
    </>
  );
}

function RouteComponent() {
  const userId = useUserId();
  const data = useLoaderData({ from: "/pets/$petId" });

  return (
    <div className="space-y-4">
      <H1>{data.name}</H1>
      <dl className="space-y-2">
        {userId === USER_ADMIN ? (
          <>
            <dt>Owner</dt>
            <dd>{data.owner}</dd>
          </>
        ) : null}
        {data.dateOfBirth ? (
          <>
            {" "}
            <dt>Date of birth</dt>
            <dd>
              <DateTime time={data.dateOfBirth} />
            </dd>
          </>
        ) : null}
        <dt>Animal</dt>
        <dd>{data.animal}</dd>
      </dl>
      <hr />
      <Allergies data={data.allergies} />
      <hr />
      <Vaccines data={data.vaccines} />
    </div>
  );
}

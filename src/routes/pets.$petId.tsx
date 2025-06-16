import { createFileRoute, useLoaderData } from "@tanstack/react-router";

import { DateTime } from "@/components/DateTime";
import { H1, H2 } from "@/components/Typography";
import { fetchPet } from "@/lib/hooks";

export const Route = createFileRoute("/pets/$petId")({
  component: RouteComponent,
  loader: async ({ params }) => {
    return fetchPet(params.petId);
  },
});

function Allergies({ data }) {
  const inner =
    data.length > 0 ? (
      <ul>
        {data.map((allergy) => (
          <li key={allergy.id}>{allergy.name}</li>
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
      <p>Add Allergy</p>
    </>
  );
}

function Vaccines({ data }) {
  const inner =
    data.length > 0 ? (
      <ul className="space-y-2">
        {data.map((vaccine) => (
          <li key={vaccine.id}>
            <DateTime date={vaccine.doa} />
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
      <p>Add Vaccine</p>
    </>
  );
}

function RouteComponent() {
  const data = useLoaderData({ from: "/pets/$petId" });

  return (
    <div className="space-y-4">
      <H1>{data.name}</H1>
      <dl className="space-y-2">
        <dt>Date of birth</dt>
        <dd>DOB</dd>
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

import {
  createFileRoute,
  notFound,
  useLoaderData,
} from "@tanstack/react-router";

import { DateTime } from "@/components/DateTime";
import {
  DeleteForm as DeleteAllergyForm,
  AllergyForm,
} from "@/components/forms/Allergy";
import {
  DeleteForm as DeleteVaccineForm,
  VaccineForm,
} from "@/components/forms/Vaccine";
import { H1, H2 } from "@/components/Typography";
import { useUserId } from "@/components/UserIntercept";
import type { AllergyRecord, Pet, VaccineRecord } from "@/db/schema";
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

function Allergy({ data, petId }: { data: AllergyRecord; petId: Pet["id"] }) {
  return (
    <div className="flex flex-row gap-2 items-center justify-between">
      <p>
        <strong>{data.name}</strong>
        {data.reaction ? (
          <>
            <br />
            Reactions: {data.reaction}{" "}
            {data.severity ? <em>({data.severity})</em> : null}
          </>
        ) : null}
      </p>
      <DeleteAllergyForm allergy={data} petId={petId} />
    </div>
  );
}

function Allergies({
  data,
  petId,
}: {
  data: Pet["allergies"];
  petId: Pet["id"];
}) {
  const userId = useUserId();
  const inner =
    data.length > 0 ? (
      <ul>
        {data.map((allergy) => (
          <li className="border-b space-y-2 py-2" key={allergy.id}>
            <Allergy data={allergy} petId={petId} />
            {allergy.deletedAt ? (
              <span className="bg-red-300 italic p-1 text-sm">
                This record was deleted on <DateTime time={allergy.deletedAt} />
              </span>
            ) : null}
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
      {userId === USER_ADMIN ? null : <AllergyForm petId={petId} />}
    </>
  );
}

function Vaccine({ data, petId }: { data: VaccineRecord; petId: Pet["id"] }) {
  return (
    <div className="flex flex-row gap-2 items-center justify-between">
      <p>
        <DateTime
          className="text-gray-500 text-sm"
          time={data.dateOfAdministration}
        />
        <br />
        {data.name}
      </p>
      <DeleteVaccineForm petId={petId} vaccine={data} />
    </div>
  );
}

function Vaccines({
  data,
  petId,
}: {
  data: Pet["vaccines"];
  petId: Pet["id"];
}) {
  const userId = useUserId();
  const inner =
    data.length > 0 ? (
      <ul className="space-y-2">
        {data.map((vaccine) => (
          <li className="border-b space-y-2 py-2" key={vaccine.id}>
            <Vaccine data={vaccine} petId={petId} />
            {vaccine.deletedAt ? (
              <span className="bg-red-300 italic p-1 text-sm">
                This record was deleted on <DateTime time={vaccine.deletedAt} />
              </span>
            ) : null}
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
      {userId === USER_ADMIN ? null : <VaccineForm petId={petId} />}
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
      <Allergies data={data.allergies} petId={data.id} />
      <hr />
      <Vaccines data={data.vaccines} petId={data.id} />
    </div>
  );
}

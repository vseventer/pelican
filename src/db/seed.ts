import "dotenv/config";

import {
  allergies,
  allergyRecords,
  animals,
  animalVaccines,
  pets,
  users,
  vaccineRecords,
  vaccines,
} from "@/db/schema";
import { db } from "@/lib/db";

// Seed the database.

// Step 1: add base data in parallel.
const [userData, animalData, vaccineData, allergyData] = await Promise.all([
  db
    .insert(users)
    .values([{ name: "Mark" }, { name: "Elliot" }])
    .returning({ id: users.id }),

  db
    .insert(animals)
    .values([{ name: "Cat" }, { name: "Dog" }, { name: "Turtle" }])
    .returning({ id: animals.id }),

  db
    .insert(vaccines)
    .values([{ name: "FVRCP" }, { name: "Rabies" }])
    .returning({ id: vaccines.id }),

  db
    .insert(allergies)
    .values([{ name: "Dust" }, { name: "Fleas" }])
    .returning({ id: allergies.id }),
]);

// Step 2: first pass of relational data: relate vaccines to animals, and pets to owner.
const [animalVaccineData, petData] = await Promise.all([
  db
    .insert(animalVaccines)
    .values([
      {
        animalId: animalData[0].id, // Cat.
        vaccineId: vaccineData[0].id, // FVRCP.
      },
      {
        animalId: animalData[0].id, // Cat.
        vaccineId: vaccineData[1].id, // Rabies.
      },
    ])
    .returning({ id: animalVaccines.id }),
  db
    .insert(pets)
    .values([
      {
        ownerId: userData[0].id,
        animalId: animalData[0].id,
        name: "Fluffly",
        dob: new Date(2010, 0, 15),
      },
      {
        ownerId: userData[1].id,
        animalId: animalData[1].id,
        name: "Buster",
        dob: new Date(2022, 3, 16),
      },
    ])
    .returning({ id: pets.id }),
]);

// Step 3: add allergy and vaccine records in parallel.
await Promise.all([
  db.insert(allergyRecords).values([
    {
      petId: petData[0].id,
      allergyId: allergyData[0].id,
      reaction: "Cough",
      severity: "mild",
    },
    {
      petId: petData[1].id,
      allergyId: allergyData[1].id,
      reaction: "Itching",
      severity: "severe",
    },
  ]),
  db.insert(vaccineRecords).values([
    {
      petId: petData[0].id,
      vaccineId: animalVaccineData[0].id,
      dateOfAdministration: new Date(),
    },
    {
      petId: petData[0].id,
      vaccineId: animalVaccineData[1].id,
      dateOfAdministration: new Date(),
    },
  ]),
]);

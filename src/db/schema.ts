import { USER_ADMIN } from "@/lib/constants";
import { type InferSelectModel } from "drizzle-orm";
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

// Shared metadata.
const metadata = {
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(new Date()),
};
const recordMetadata = {
  ...metadata,
  deletedAt: integer("deletedAt", { mode: "timestamp" }),
};

// Users.
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  ...metadata,
});
export type User =
  | InferSelectModel<typeof users>
  | { id: typeof USER_ADMIN; name: "Administrator" };

// Animals.
export const animals = sqliteTable("animals", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  ...metadata,
});
export type Animal = InferSelectModel<typeof animals>;

// Pets.
export const pets = sqliteTable("pets", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  dateOfBirth: integer("dob", { mode: "timestamp" }),
  ownerId: integer("owner_id")
    .notNull()
    .references(() => users.id),
  animalId: integer("animal_id")
    .notNull()
    .references(() => animals.id),
  ...metadata,
});

// Allergies.
export const allergies = sqliteTable("allergies", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  ...metadata,
});
type Allergy = InferSelectModel<typeof allergies>;

// Vaccines.
export const vaccines = sqliteTable("vaccines", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  ...metadata,
});
type Vaccine = InferSelectModel<typeof vaccines>;

// Pairing of animals and their vaccines.
export const animalVaccines = sqliteTable("animal_vaccines", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  animalId: integer("animal_id")
    .notNull()
    .references(() => animals.id),
  vaccineId: integer("vaccine_id")
    .notNull()
    .references(() => vaccines.id),
  ...metadata,
});
export type AnimalVaccine = InferSelectModel<typeof animalVaccines>;

// Allergy records.
export const allergyRecords = sqliteTable("allergy_records", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  petId: integer("pet_id")
    .notNull()
    .references(() => pets.id),
  allergyId: integer("allergy_id")
    .notNull()
    .references(() => allergies.id),
  reaction: text("reaction"),
  severity: text("severity").notNull(),
  ...recordMetadata,
});
export type AllergyRecord = InferSelectModel<typeof allergyRecords> & {
  name: Allergy["name"];
};

// Vaccine records.
export const vaccineRecords = sqliteTable("vaccine_records", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  petId: integer("pet_id")
    .notNull()
    .references(() => pets.id),
  vaccineId: integer("vaccine_id")
    .notNull()
    .references(() => animalVaccines.id),
  dateOfAdministration: integer("doa", { mode: "timestamp" }).notNull(),
  ...recordMetadata,
});
export type VaccineRecord = InferSelectModel<typeof vaccineRecords> & {
  name: Vaccine["name"];
};

export type Pet = InferSelectModel<typeof pets> & {
  owner: User["name"];
  animal: Animal["name"];
  allergies: AllergyRecord[];
  vaccines: VaccineRecord[];
  availableAllergies: Allergy[];
  availableVaccines: Vaccine[];
};

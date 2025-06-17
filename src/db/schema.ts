import { sql } from "drizzle-orm";
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

// Shared metadata.
const metadata = {
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(current_timestamp)`),
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

// Animals.
export const animals = sqliteTable("animals", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").unique(),
  ...metadata,
});

// Pets.
export const pets = sqliteTable("pets", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  dob: integer("dob", { mode: "timestamp" }),
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
  name: text("name").unique(),
  ...metadata,
});

// Vaccines.
export const vaccines = sqliteTable("vaccines", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").unique(),
  ...metadata,
});

// Pairing of animals and their vaccines.
export const animalVaccines = sqliteTable("animal_vaccines", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  animalId: integer("animal_id")
    .notNull()
    .references(() => animals.id),
  vaccineId: integer("vaccine_id")
    .notNull()
    .references(() => vaccines.id),
  frequency: text("frequency"),
  ...metadata,
});

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

export default {
  users,
  animals,
  pets,
  allergies,
  vaccines,
  animalVaccines,
  allergyRecords,
  vaccineRecords,
};

# Pelican

> A MVP-app for tracking your pet's medical records.

## Getting Started

Development environment:

1. `npm run install`
2. `npm run start`

Production environment:

1. `npm run install`
2. `npm run preview`

## Architecture

The basic app scaffolding and running took under 30 minutes.

- **[TanStack Start](https://tanstack.com/start)** to rapidly bootstrap the app without manually configuring:

  - API layer
  - React setup
  - Routing
  - 404 and global error handling

- While still in beta, it's ideal for MVP-level experimentation and accelerates development.

## Tooling & Core Libraries

- **Linting**: Added standard linting setup with default configurations.
- **ORM**: Selected **[Drizzle ORM](https://orm.drizzle.team/)** for database access. While I have no experience with Drizzle, I am excited to try it out hoping it's more lightweight and simpler than Prisma (which felt too heavy for MVP scope).
- **Forms**: Added **react-hook-form** to manage form state and validation in a declarative and performant way.
- **UI**: Integrated **Tailwind CSS** for consistent design and rapid UI development.

## Features

- Admin users can:

  - View **soft-deleted records** (e.g., historical allergy or vaccine data that a user marked as removed)
  - See full medical history for any pet, even past modifications

- Users and admins can:

  - Add new **pets**, including selecting type.
  - Create new **animals**, **allergies**, and **vaccines** on the fly — despite the normalized structure

    - This is aided by unique constraints at the DB level to prevent duplicates
    - In a production app, this would require additional validation and administrative workflows

## Database Schema

**Normalization & Modularity**:

- The schema is well-normalized:
- Animals and vaccines are decoupled, allowing fine-grained control of vaccine schedules per species (animal_vaccines).
- Pets link to users and animals, maintaining clear separation between general species-level data and individual pets.
- Vaccine records link to the animal_vaccines table rather than vaccines directly — enforcing correct pairings and supporting animal-specific schedules.

**Auditability:**

- Every table includes createdAt, and key medical records use a deletedAt timestamp to enable soft-deletion.
- This makes it possible to audit the full historical medical trail of any pet, even if records are “removed” from the user’s perspective.

**Extensibility:**

- By modeling vaccine applicability with the animal_vaccines join table, the schema supports future logic like showing overdue vaccinations based on species.
- You could easily extend this to support vaccine frequency or schedule data (e.g., interval_days).

**Data Integrity:**

- All foreign keys are explicitly enforced (references(() => ...)).

- Unique constraints on names (e.g., animals, allergies, vaccines) help reduce redundancy even when user-created entries are allowed.

**UX Considerations:**

- Pet owners can freely add new allergy/vaccine names, with constraints helping dedupe at the DB level — a good trade-off between MVP simplicity and data cleanliness.

> [!NOTE]
>
> - All history is traceable. Nothing is permanently deleted.
> - The GitHub repo includes a pre-built SQLite file with basic sample data.
> - The `db/` folder contains the seed script.

## Front-End

The UI consists of header (medical card with company name), sidebar, main section, and footer. On smaller viewports, the sidebar and main content are stacked instead. The pages include:

- **Landing Page** (unauthenticated):

  - Lists all users
  - Allows creation of a new user

- **Home Page** (authenticated):

  - Lists pets for the current user on the left sidebar
  - Clicking a pet opens the detailed view

- **Details Page**:

  - Shows pet info, including allergies and vaccines
  - Allows adding new allergies and vaccine records

## Back-End

API routes follow REST principles and are co-located with the front-end using TanStack Start’s file-based routing. Major endpoints include:

- **Users**

  - `GET /api/users` — List all users
  - `GET /api/users/:id` — Get a specific user
  - `POST /api/users` — Create a new user

- **Pets**

  - `GET /api/pets` — Admin: List all pets
  - `GET /api/pets/:id` — Get a specific pet
  - `POST /api/pets` — Create new pet

- **Validation**

  - All data mutating endpoints use **Zod** for schema validation
  - Shared schemas between front-end and back-end ensure consistency and type safety

## Polish

The following small items were accomplished to give the MVP a bit more character:

- Name. Pelican sounds like a bit like "Medical", "Can", and starts with "Pe" from pet.
- Logo. Yes, behind the scene it's all Dr. Pelican Ph.D. keeping the records.
- Documentation was assisted by ChatGPT, which helped structure and write readable summaries based on design and architectural decisions.

## Findings

- My unfamiliarity with **Drizzle** and **TanStack Start** slowed me down:

  - While I know SQL well, I found Drizzle less productive for writing SQL-like logic programmatically. I’ll look for alternatives next time.
  - TanStack Start provides a lot out-of-the-box — possibly more than this MVP required.

- Clean TypeScript usage took time, especially aligning inferred and explicit types. There’s much more that could be typed, but I had to draw the line.
- Setting up a basic query-string-based **Auth** took longer than expected.
- Added proper `NotFound` and global error pages took a bit of time, but add a lot of value.
- Implemented both frontend and backend **validation** to ensure input sanitation and avoid malicious data insertion.

## Future Improvements

There's a number of items listed below where improvements can be made.

- **Build Optimization**:

  - Remove unused CSS
  - Add bundle splitting and optimize image assets for production

- **UI Enhancements**:

  - Replace inline editing with modals for more structured workflows
  - Enable deeplinking to modals to create new records (for better navigation and shareability)
  - Extract repeated styles (e.g. inputs) to common components so that they can easily be reused.

- **Testing**:

  - Add basic UI tests for core flows (authentication, adding medical records)
  - Add backend tests to validate input handling and access control logic (e.g., authorization checks)

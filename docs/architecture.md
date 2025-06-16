# 🛠 Project Setup Summary

The basic app scaffolding and running took under 30 minutes.

## Architecture

- **[TanStack Start](https://tanstack.com/start)** to rapidly bootstrap the app without manually configuring:
  - API layer
  - React setup
  - Routing
  - 404 and global error handling
- While still in beta, it's ideal for MVP-level experimentation and accelerates development.

## 🧱 Tooling & Core Libraries

- **Linting**: Added standard linting setup with default configurations.
- **ORM**: Selected **[Drizzle ORM](https://orm.drizzle.team/)** for database access. While I have no experience with Drizzle, I am excited to try it out hoping it's more lightweight and simpler than Prisma (which felt too heavy for MVP scope).
- **Forms**: Added **react-hook-form** to manage form state and validation in a declarative and performant way. **Zod** for data validation.
- **UI**: Integrated **shadcn/ui** components with **Tailwind CSS** for consistent design and rapid UI development.

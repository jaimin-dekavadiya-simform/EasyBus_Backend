# 🚌 EasyBus Backend

A RESTful backend service for a **bus ticket booking system**, built as part of an internship project. The service is written in TypeScript and follows a clean, modular architecture with strict code quality tooling enforced at every commit.

> ⚠️ **Note:** This project is currently in active development. Features are being added incrementally.

---

## Tech Stack

| Layer         | Technology                                    |
| ------------- | --------------------------------------------- |
| Runtime       | Node.js                                       |
| Framework     | Express.js v5                                 |
| Language      | TypeScript                                    |
| ORM           | Prisma v7                                     |
| Database      | PostgreSQL (via `pg` + `@prisma/adapter-pg`)  |
| Caching       | Redis (via `ioredis`)                         |
| Auth          | JWT (`jsonwebtoken`) + bcrypt                 |
| Validation    | Zod                                           |
| Linting       | ESLint (v10, flat config) + TypeScript ESLint |
| Formatting    | Prettier                                      |
| Git Hooks     | Husky + lint-staged                           |
| Commit Policy | Commitlint (Conventional Commits)             |

---

## Prerequisites

Make sure the following are installed on your machine before setting up the project:

- **Node.js** >= 18.x
- **npm** >= 9.x
- **PostgreSQL** — a running instance with a database created
- **Redis** — a running local or remote instance

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/jaimin-dekavadiya-simform/EasyBus_Backend.git
cd EasyBus_Backend
```

### 2. Install dependencies

```bash
npm install
```

This will also automatically run `husky install` via the `prepare` lifecycle script, setting up Git hooks.

### 3. Set up environment variables

Create a `.env` file in the project root:

```env
# Server
PORT=3000

# PostgreSQL
DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<database>

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
```

> Replace the placeholder values with your actual credentials.

### 4. Run Prisma migrations

```bash
npx prisma migrate dev
```

This will apply all migrations in `prisma/migrations/` and generate the Prisma client.

### 5. Generate Prisma Client (if needed separately)

```bash
npx prisma generate
```

---

## Running the Server

### Development (with hot reload)

```bash
npm run dev
```

Uses `tsx watch` to run `src/server.ts` with live reloading on file changes.

### Production

```bash
# Build TypeScript to JavaScript
npm run build

# Start the compiled server
npm start
```

The build output is placed in the `dist/` directory. The entry point is `dist/server.js`.

---

## Available Scripts

| Script            | Description                                                   |
| ----------------- | ------------------------------------------------------------- |
| `npm run dev`     | Start the dev server with hot reload (`tsx watch`)            |
| `npm run build`   | Compile TypeScript to `dist/`                                 |
| `npm start`       | Run the compiled production build                             |
| `npm run lint`    | Run ESLint on `src/` and auto-fix issues                      |
| `npm run prepare` | Install Husky Git hooks (runs automatically on `npm install`) |

---

## Folder Structure

```
EasyBus_Backend/
│
├── prisma/
│   ├── schema.prisma          # Prisma data models & datasource config
│   └── migrations/            # Auto-generated migration history
│
├── src/                       # All application source code
│   └── server.ts              # Express app entry point
│
├── .husky/                    # Husky Git hook scripts
│   └── pre-commit             # Runs lint-staged before every commit
│
├── dist/                      # Compiled JavaScript output (git-ignored)
│
├── .env                       # Environment variables (git-ignored)
├── .gitignore
├── .prettierrc                # Prettier formatting rules
├── commitlint.config.js       # Conventional commit enforcement config
├── eslint.config.mjs          # ESLint flat config (TypeScript + Prettier rules)
├── prisma.config.ts           # Prisma CLI config (schema path, migrations path)
├── tsconfig.json              # TypeScript compiler options
└── package.json
```

---

## Code Quality & Tooling

### ESLint

Configured via `eslint.config.mjs` using the modern flat config format. Uses `typescript-eslint` for TypeScript-aware linting, with Prettier integrated as an ESLint rule. The `no-console` rule is set to `warn`.

### Prettier

Formatting rules are defined in `.prettierrc`. Prettier runs automatically via `lint-staged` on every commit, and violations are surfaced as ESLint errors.

### Husky + lint-staged

A `pre-commit` hook runs `lint-staged` before every commit. This automatically runs ESLint (with `--fix`) and Prettier on all staged `.ts` and `.js` files, ensuring no unformatted or linting-errored code ever gets committed.

### Commitlint

Commit messages are validated against the [Conventional Commits](https://www.conventionalcommits.org/) specification. Invalid commit messages will be rejected at commit time.

Valid commit message format:

```
<type>(optional scope): <description>

# Examples:
feat(auth): add JWT refresh token support
fix(booking): handle seat already booked edge case
chore: update prisma to v7
```

---

## TypeScript Configuration

The project is compiled with strict settings (`"strict": true`), targeting **ES2021** with `CommonJS` modules. Key settings:

- Source root: `src/`
- Output directory: `dist/`
- Path alias: `@/*` → `./src/*`
- Strict checks enabled: `noImplicitReturns`, `noImplicitOverride`, `noUnusedLocals`, `noUnusedParameters`, `exactOptionalPropertyTypes`
- Source maps and declaration files are generated on build

---

## Database

The project uses **PostgreSQL** via Prisma's `pg` driver adapter. The Prisma schema and migration paths are configured in `prisma.config.ts`:

- **Schema:** `prisma/schema.prisma`
- **Migrations:** `prisma/migrations/`
- **Connection URL:** read from `DATABASE_URL` environment variable

Useful Prisma commands:

```bash
# Create a new migration
npx prisma migrate dev --name <migration_name>

# Open Prisma Studio (GUI for your database)
npx prisma studio

# Reset database (drops & re-applies all migrations)
npx prisma migrate reset

# Push schema changes without creating a migration file (prototyping)
npx prisma db push
```

## Contributing

This project enforces conventional commits and pre-commit linting. Before submitting a PR:

1. Make sure `npm run lint` passes with no errors.
2. Use conventional commit messages (`feat:`, `fix:`, `chore:`, etc.).
3. Do not commit directly to `main` — use feature branches.

---

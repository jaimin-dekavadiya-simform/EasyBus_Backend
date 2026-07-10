# 🚌 EasyBus Backend

## What is EasyBus?

EasyBus is a **multi-tenant bus transportation management platform** backend built with Node.js. It allows multiple bus transport organizations (like state transport corporations or private bus operators) to manage their fleet, routes, trips, and seat availability — all from a single system, isolated per tenant.

Think of it as the backend for an app like RedBus or AbhiBus, but designed to be operated by the transport companies themselves.

---

## What Problem Does It Solve?

Bus transport companies need a system to:

1. **Define their bus fleet** — Register buses with seat layouts (seater, sleeper, AC, etc.)
2. **Set up routes** — Create routes as an ordered sequence of stops with distances and travel times
3. **Schedule trips** — Assign a bus and conductor to a route on a specific date/time
4. **Let passengers search** — Find available trips between any two stops on a given date
5. **Show seat-level availability** — Display exactly which seats are free for a given journey, even on trips where passengers board/alight at different stops along the route

EasyBus handles all of this with proper role-based access, multi-org isolation, and efficient seat tracking.

---

## Core Concepts

### Multi-Tenancy

Each bus company is an **Organization** with a unique `tenantId`. All resources (buses, routes, trips) are scoped to an organization. A `SUPER_ADMIN` manages the platform and can operate across all orgs, while `ORG_ADMIN`, `OPERATOR`, and `CONDUCTOR` users are bound to their own organization.

### Role Hierarchy

```
SUPER_ADMIN (50)  →  Platform-wide access, creates orgs and manages everything
    ↓
ORG_ADMIN (40)    →  Manages their own organization's fleet, routes, trips
    ↓
OPERATOR (30)     →  Creates trips and manages scheduling within their org
    ↓
CONDUCTOR (20)    →  Assigned to trips, manages on-board operations
    ↓
PASSENGER (10)    →  Registers publicly, searches and books trips
```

Roles have numeric weights. A user can only create users with a **lower** weight than their own — this prevents privilege escalation.

### Seat Bitmap System

This is the most interesting technical aspect. Instead of storing individual seat bookings as rows, each **trip segment** (the leg between two consecutive stops) stores a **bitmap string** using PostgreSQL's `varbit` type.

For example, a 5-seat bus would have: `11111` (all available). When seat 2 is booked for that segment, it becomes: `11011`.

When a passenger wants to travel from Stop A to Stop C (passing through Stop B), we perform a **bitwise AND** across all segments (A→B and B→C) to find seats available for the entire journey:

```
Segment A→B:  11011
Segment B→C:  10111
              -----
AND result:   10011  →  Seats 1, 4, 5 are available for the full A→C journey
```

This makes availability queries very efficient, even for long routes with many intermediate stops.

---

## What's Been Built So Far

### ✅ Authentication & Email Verification
- Passenger self-registration with email verification (Nodemailer + Gmail)
- JWT-based login with `httpOnly` cookie storage (access + refresh tokens)
- Login, logout, email resend, and `/me` endpoint for session check
- Internal user creation by admins (staff users are auto-verified)

### ✅ Organization Management
- Super admins can create new organizations (tenants)
- Each org is identified by a unique `tenantId`

### ✅ Seat Layout Configuration
- Define bus seat layouts as a JSON config with grid-based positioning
- Support for multiple deck types (lower/upper)
- Seat types: `SEAT`, `SLEEPER`, `DRIVER`, `CONDUCTOR`, `DOOR`
- Auto-computes `totalSeats` and assigns `bitIndex` to each bookable seat

### ✅ Route & Stop Management
- Create named stops (bus stations) — super admin only
- List all available stops
- Create routes as ordered sequences of stops with per-stop distance and travel time
- Cumulative distance/time from origin is auto-calculated

### ✅ Bus Fleet Management
- Register buses with a label, registration number, bus class, seat layout, and organization
- Registration number validation (Indian vehicle format: `GJ05AB1234`)
- Supports 6 bus classes: `SEATER`, `SEMI_SLEEPER`, `SLEEPER`, `AC_SEATER`, `AC_SEMI_SLEEPER`, `AC_SLEEPER`

### ✅ Trip Scheduling
- Create trips by assigning a bus, conductor, route, and departure time
- Arrival time auto-calculated from route data
- **Overlap detection** — Prevents double-booking of conductors and buses
- Trip segments auto-generated with `varbit` bitmaps (all seats available initially)
- Fare multiplier system for different seat types

### ✅ Trip Search
- Search trips between any two stops on a given date
- Returns calculated distance, travel time, and **minimum available seats** across all segments
- Raw SQL query joining route stops with trips for performance

### ✅ Trip Details with Seat Availability
- Fetch full trip details including organization, route with all stops, bus with seat layout
- Bitmap merging (bitwise AND) to compute per-seat availability for any journey leg
- Returns the merged bitmap so the frontend can render an interactive seat map

---

## What's Remaining

### 🔲 Booking Module
- Seat selection and reservation
- Bitmap updates on `TripSegment` records (flip `1` → `0` for booked seats)
- Booking records with passenger details, PNR generation
- Booking cancellation and seat release (flip `0` → `1`)
- Booking history for passengers

### 🔲 Payment Module
- Payment gateway integration
- Payment status tracking (pending, completed, failed, refunded)
- Linking payments to bookings
- Refund processing on cancellation

### 🔲 Other Potential Enhancements
- Refresh token rotation
- Password reset flow
- Trip status updates (SCHEDULED → BOARDING → IN_PROGRESS → COMPLETED)
- Pagination and filtering on list endpoints
- Rate limiting and request throttling
- Admin dashboard analytics

---

## Tech Stack at a Glance

| What           | Technology                              |
| -------------- | --------------------------------------- |
| Runtime        | Node.js + TypeScript (ESM)              |
| Framework      | Express.js v5                           |
| Database       | PostgreSQL                              |
| ORM            | Prisma v7 (with `@prisma/adapter-pg`)   |
| Validation     | Zod v4                                  |
| Auth           | JWT + bcrypt + httpOnly cookies         |
| Email          | Nodemailer (Gmail)                      |
| Logging        | Pino                                    |
| Code Quality   | ESLint + Prettier + Husky + Commitlint  |

---

## Project Structure (Quick Reference)

```
src/
├── config/          # Environment validation, Prisma client setup
├── middleware/       # Auth, validation, error handling
├── types/           # Shared TypeScript types
├── utils/           # ApiResponse, ApiError, asyncHandler, crypto, logger
├── modules/
│   ├── common/
│   │   └── email/   # Email service and templates
│   └── core/
│       ├── auth/          # Register, login, logout, verify email
│       ├── user/          # Internal user creation
│       ├── organization/  # Tenant management
│       ├── seatLayout/    # Bus seat layout configs
│       ├── route/         # Routes and stops
│       ├── bus/           # Bus fleet
│       └── trip/          # Trip scheduling, search, seat availability
├── prisma/          # Schema + migrations
└── seed/            # Database seeding
```

Each module follows the pattern: **Router → Controller → Service → Repository**, with separate files for validation schemas (Zod), types, and utils.

---

## How to Run

```bash
npm install            # Install deps + auto-generate Prisma client
cp .env.example .env   # Configure environment variables
npx prisma migrate deploy   # Run migrations
npm run seed           # (Optional) Seed the database
npm run dev            # Start dev server with hot reload
```

> For the full API reference with request/response examples, see [API_DOC.md](./API_DOC.md).

# SlotYourGame

A cricket team management and ground-booking platform for grassroots cricket in India — schedule fixtures, book grounds, track player stats, and run leagues, all in one place.

**Live repo:** [MuthuRM354/slotyourgame](https://github.com/MuthuRM354/slotyourgame)

## Features

- **Ground booking** — browse verified cricket grounds, check slot availability, and book instantly
- **Fixture management** — schedule T20s, nets, and tournaments; players RSVP with one tap
- **Player stats & leaderboards** — track runs, wickets, and match history
- **League management** — organize and run leagues/tournaments
- **Team roster & attendance** tracking
- **Marketplace** for gear/equipment
- **Wallet** for payments
- **Role-based access control** — `player`, `captain`, `ground_admin` (venue owner), `league_admin`, `super_admin`, mirroring a Java backend's `UserRole` enum

## Tech Stack

- **Next.js 16** (App Router)
- **React 19**
- **Tailwind CSS 4**
- **lucide-react** for icons
- Integrates with a separate Java/Spring backend (role names are normalized from the backend's enum in `lib/rbac.js`)

## Project Structure

```
app/
├── page.jsx                # Landing page
├── auth/                   # Login / register
├── grounds/                # Ground listing & detail ([id])
├── bookings/                # User bookings
├── wallet/                  # Wallet & payments
├── profile/                  # User profile
├── setup/                    # Onboarding/setup flow
└── dashboard/
    ├── bookings/  fixtures/  leagues/  roster/
    ├── attendance/  availability/  grounds/
    ├── manage/  marketplace/  stats/
    └── layout.jsx, page.jsx

components/
├── auth/                   # Auth-related components
├── dashboard/               # Sidebar, TopBar
├── shared/                  # RoleGuard (RBAC gate)
└── ui/                      # Shared UI primitives

lib/
├── api.js                   # API client
├── auth.js                   # Auth helpers
├── rbac.js                   # Role hierarchy & permission checks
└── useRole.js                 # Hook for current user's role
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/MuthuRM354/slotyourgame.git
cd slotyourgame
npm install
```

### Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build for production

```bash
npm run build
npm start
```

## Roles & Permissions

Role hierarchy (lowest to highest): `player` → `captain` → `ground_admin` → `league_admin` → `super_admin`. `ground_admin` is scoped (can only act as itself or be overridden by `super_admin`); other roles inherit permissions from roles below them. See `lib/rbac.js` for the exact rules and `components/shared/RoleGuard.jsx` for how routes/UI enforce them.

## License

Not yet specified.

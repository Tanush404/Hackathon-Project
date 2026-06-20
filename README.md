# Proof of Build

Proof of Build is a decentralized auditing and validation platform designed to verify software developers' code artifacts, repository complexities, and live app deployment uptimes, generating cryptographic signatures for verified portfolios.

---

## 🛠️ Technology Stack

This project is built using a modern **TypeScript Monorepo** powered by **npm Workspaces**:

- **Frontend**: Next.js 14 (Pages Router) & React 18
- **Backend**: NestJS 10 (Controllers, Services, Modules architecture)
- **Database Layer**: Prisma ORM (configured for PostgreSQL)
- **AI Engine**: Google Gemini AI (leveraging `gemini-1.5-flash` model)
- **Styling**: Vanilla CSS with custom theme variables (incorporating dark-mode & glassmorphism)
- **Cryptography**: Node.js `crypto` (HMAC-SHA256 ledger signatures) & `jsonwebtoken`

---

## 📁 Repository Structure

```text
proof-of-build/
├── apps/
│   ├── api/                    # NestJS backend API gateway (port 3001)
│   └── web/                    # Next.js frontend client (port 3000)
├── packages/
│   ├── database/               # Shared Prisma schema & PostgreSQL client definitions
│   └── ts-types/               # Shared TypeScript data transfer interfaces
├── package.json                # Root workspaces orchestrator
└── README.md                   # Project documentation
```

---

## 🚀 Getting Started

### 📋 Prerequisites

Ensure you have [Node.js (v18 or higher)](https://nodejs.org/) installed on your machine.

### 🔧 Installation & Workspace Setup

1. **Install Root and Workspace Dependencies**:
   ```bash
   npm install
   ```

2. **Generate Database Client Schema**:
   Generate the local Prisma Client bindings:
   ```bash
   npx prisma generate --schema=packages/database/schema.prisma
   ```

---

## ⚙️ Environment Configurations

Create a `.env` file in the root directory (or specific workspaces) with the following parameters:

### Database Settings
In `packages/database/.env`:
```env
DATABASE_URL="postgresql://<user>:<password>@localhost:5432/<dbname>?schema=public"
```

### Backend settings
In `apps/api/.env`:
```env
GEMINI_API_KEY="your-gemini-api-key"
```

---

## 🏃 Running the Application

Start the frontend and backend development servers concurrently from the root directory:

```bash
npm run dev
```

- **Frontend**: View the client dashboard at [http://localhost:3000](http://localhost:3000)
- **Backend API**: The NestJS gateway runs at [http://localhost:3001/api](http://localhost:3001/api)

---

## 💎 Core Features

1. **GitHub Repository Scans**: Calculates Repository Complexity Scores (RCS) based on line counts, languages, and star popularity, coupled with automated Gemini AI code quality reviews.
2. **Live Endpoint Auditing**: Queries target HTTP endpoints to verify response times, SSL certificate authority chains, and status codes.
3. **Cryptographic Proof Ledger**: Signs audit reports using HMAC-SHA256 to generate tamper-proof proof records for developer portfolios.

# Backend

TypeScript backend for PSPACE Logbook using Express + Prisma + PostgreSQL.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create env file:

```bash
cp .env.example .env
```

3. Update `.env`:

```env
PORT=4000
NODE_ENV=development
DATABASE_URL=postgresql://appuser:your_password@localhost:5432/pspace_logbook_dev?schema=public
JWT_SECRET=your-long-random-secret
```

4. Generate Prisma client and run migration:

```bash
npx prisma generate
npx prisma migrate dev --name init_auth
```

5. Run backend:

```bash
npm run dev
```

## Endpoints

- `GET /health`
- `POST /api/auth/register`
- `POST /api/auth/login`

### Register payload

```json
{
  "profileImage": "https://example.com/avatar.jpg",
  "fullName": "Juan dela Cruz",
  "dateOfBirth": "2000-01-20",
  "email": "juan@example.com",
  "password": "securePass123"
}
```

### Login payload

```json
{
  "email": "juan@example.com",
  "password": "securePass123"
}
```

## CI/CD

Backend workflow file is in repo root:
- `.github/workflows/backend.yml`

Required location note:
- GitHub only recognizes workflow files under the root `.github/workflows` directory.

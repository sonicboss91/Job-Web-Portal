# ClearJunk Portal (Internal Admin)

A full-stack internal portal for ClearJunk staff to manage daily job operations.

## Stack
- React (Vite) frontend
- Node.js + Express backend
- SQLite database
- JWT authentication

## Features
- Staff login (email/password)
- Daily schedule dashboard
- Jobs CRUD for UK waste-clearance workflow (ref, customer, address/postcode, date, window, volume, pricing, notes)
- Route optimisation page with Google Maps links
- Internal-first defaults (self-signup disabled)

## Project Structure
- `client/` React app
- `server/` Express API + SQLite

## Getting Started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy env file for server:
   ```bash
   cp server/.env.example server/.env
   ```
3. Create initial staff account:
   ```bash
   npm run create-admin --workspace server -- staff@clearjunk.com strongpassword
   ```
4. Start both apps:
   ```bash
   npm run dev
   ```

Frontend: `http://localhost:5173`  
Backend: `http://localhost:4000`

## Environment
`server/.env`
- `PORT` (default `4000`)
- `JWT_SECRET` (required in production)
- `ALLOW_SELF_SIGNUP` (`false` by default; set to `true` only for controlled onboarding)

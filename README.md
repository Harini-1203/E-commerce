# e-com (basic MERN scaffold)

This repository contains a minimal MERN scaffold (backend + frontend skeleton) to help you get started.

## Structure

- backend/ - Express server, routes, controllers, Mongoose model
- frontend/ - minimal React app skeleton (no full bundler configuration)

## Quick notes

Backend:
- API entry: `backend/server.js`
- Env: copy `backend/.env.example` to `.env` and set `MONGO_URI` and optionally `PORT`.

Frontend:
- Minimal React files under `frontend/src` and `frontend/public`.
- Add your preferred bundler (Vite, CRA, Parcel) or wire up a build tool.

## Run (backend)

1. cd backend
2. npm install
3. npm run dev   # uses nodemon (if installed)

Frontend: add your preferred dev server or open `frontend/public/index.html` directly for quick testing.

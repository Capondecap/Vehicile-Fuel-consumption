# Vehicle Fuel Consumption Tracker

A full-stack web application for tracking and managing vehicle fuel consumption records, with both a server-rendered web interface and a REST API.

## Project Structure

```
Vehicile-Fuel-consumption/
├── .env.example                        # Environment variable template
├── .gitignore
├── package.json
└── src/
    ├── app.js                          # Express app setup (middleware, view engine)
    ├── server.js                       # HTTP server entry point
    ├── config/
    │   ├── db.js                       # Database connection
    │   ├── jwt.js                      # JWT configuration
    │   └── session.js                  # Session configuration
    ├── controllers/
    │   ├── api/
    │   │   ├── apiAuthController.js    # API authentication (register, login, logout)
    │   │   └── apiRecordController.js  # API CRUD for fuel records
    │   └── web/
    │       ├── authController.js       # Web auth (session-based)
    │       └── recordController.js     # Web CRUD for fuel records
    ├── middlewares/
    │   ├── authMiddleware.js           # Session-based auth guard
    │   ├── csrfMiddleware.js           # CSRF protection
    │   ├── errorHandler.js             # Global error handler
    │   └── jwtMiddleware.js            # JWT auth guard for API routes
    ├── models/
    │   ├── FuelRecord.js               # Fuel record schema/model
    │   └── User.js                     # User schema/model
    ├── routes/
    │   ├── api/
    │   │   ├── authRoutes.js           # POST /api/auth/*
    │   │   └── recordRoutes.js         # GET|POST|PUT|DELETE /api/records
    │   └── web/
    │       ├── authRoutes.js           # GET|POST /login, /register, /logout
    │       └── recordRoutes.js         # GET|POST /records/*
    ├── services/
    │   ├── fuelService.js              # Fuel record business logic
    │   └── userService.js              # User business logic
    ├── utils/
    │   ├── dateUtils.js                # Date formatting helpers
    │   └── validator.js                # Input validation helpers
    └── views/                          # Handlebars templates
        ├── layouts/
        │   └── main.hbs               # Base layout
        ├── auth/
        │   ├── login.hbs
        │   └── register.hbs
        ├── dashboard/
        │   └── index.hbs
        └── records/
            ├── create.hbs
            └── edit.hbs
```

## Tech Stack

- **Runtime** — Node.js
- **Framework** — Express.js
- **View Engine** — Handlebars (`.hbs`)
- **Auth** — Session-based (web) + JWT (API)
- **Security** — CSRF protection

## Getting Started

1. Copy the environment template and fill in your values:
   ```bash
   cp .env.example .env
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT |
| GET | `/api/records` | List all fuel records |
| POST | `/api/records` | Create a fuel record |
| PUT | `/api/records/:id` | Update a fuel record |
| DELETE | `/api/records/:id` | Delete a fuel record |

## Web Routes

| Method | Path | Description |
|--------|------|-------------|
| GET | `/login` | Login page |
| POST | `/login` | Submit login form |
| GET | `/register` | Registration page |
| POST | `/register` | Submit registration form |
| GET | `/` | Dashboard |
| GET | `/records/create` | New record form |
| GET | `/records/:id/edit` | Edit record form |

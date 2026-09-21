# Himani Timilsena Portfolio

A modern personal portfolio website built with React + Vite, featuring a responsive layout, dark/light theme support, project management, and a protected admin dashboard for maintaining portfolio content.

## Tech Stack

- Frontend: React 19, Vite, React Router
- Styling: CSS with custom properties and component styling
- Animations: Framer Motion
- Backend: Node.js, Express
- Auth: JWT, bcrypt, HTTP-only cookies
- Data storage: JSON file in the server data folder
- Linting: Oxlint

## Project Structure

```bash
hhjj/
├── index.html
├── package.json
├── vite.config.js
├── public/
├── server/
│   ├── index.js
│   ├── .env.example
│   ├── hash-password.mjs
│   └── data/
│       ├── projects.json
│       └── posts.json
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── App.css
│   ├── index.css
│   ├── assets/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Hero.jsx
│   │   ├── About.jsx
│   │   ├── Projects.jsx
│   │   ├── Skills.jsx
│   │   ├── Contact.jsx
│   │   ├── Blog.jsx
│   │   ├── Resume.jsx
│   │   ├── Footer.jsx
│   │   ├── ThemeToggle.jsx
│   │   └── admin/
│   │       ├── AdminDashboard.jsx
│   │       ├── AdminLogin.jsx
│   │       └── AdminRoute.jsx
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   ├── AuthProvider.jsx
│   │   ├── useAuth.js
│   │   ├── NotificationContext.jsx
│   │   ├── NotificationProvider.jsx
│   │   ├── useNotification.js
│   │   ├── ProjectsContext.jsx
│   │   ├── ProjectsProvider.jsx
│   │   ├── useProjects.js
│   │   ├── ThemeContext.jsx
│   │   ├── useTheme.js
│   │   └── ...
│   └── data/
│       └── projectsData.js
└── README.md
```

## Features

- Responsive portfolio home page
- Projects showcase with categories and project metadata
- Blog with public reading view and admin-managed posts (drafts hidden from public)
- Light and dark theme toggle
- Contact and resume sections
- Protected admin dashboard for adding, editing, and deleting projects and blog posts
- Express API for project management, blog posts, and auth

## Prerequisites

- Node.js 18 or later
- npm

## Installation

```bash
cd hhjj
npm install
```

## Environment Setup

Create the server environment file from the example:

```bash
copy server\.env.example server\.env
```

Then update the variables in `server/.env`:

```env
PORT=3001
NODE_ENV=development
CLIENT_URL=http://localhost:5173
JWT_SECRET=your-very-strong-random-string-at-least-32-chars
ADMIN_PASSWORD_HASH=
```

For local development, use a secret-only value in `server/.env` and never commit it to source control.

## Run the Project

### Run both frontend and backend together

```bash
npm run dev:full
```

This starts:

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

### Run frontend only

```bash
npm run dev
```

### Run backend only

```bash
npm run dev:server
```

### Build for production

```bash
npm run build
npm start
```

## Admin Access

The admin dashboard is protected by server-side JWT authentication and is not intended to be exposed in public documentation or navigation.

Set a strong admin password via `ADMIN_PASSWORD_HASH` in `server/.env` and never commit plaintext secrets to version control.

## Available Scripts

```bash
npm run dev
npm run dev:server
npm run dev:full
npm run build
npm start
npm run gen:hash
```

## Notes

- The project data is stored in `server/data/projects.json`.
- The backend serves the built frontend when a production build exists.
- The admin area is protected using JWT authentication and HTTP-only cookies.

## License

This project is for personal portfolio use.

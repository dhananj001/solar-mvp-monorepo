# Solar MVP Dashboard – Fullstack MERN Project

_A modern CRM and project management dashboard built with React 19, Node.js (Express), MongoDB Atlas, and Vite. Features a clean Apple macOS-inspired Dock UI._

---

## Live Demo
- **Frontend (Vercel):** [https://solar-mvp-monorepo.vercel.app]
- **Backend (Render):** [https://solar-mvp-monorepo.onrender.com]
- **GitHub Repo:** [https://github.com/dhananj001/solar-mvp-monorepo]

---

## Screenshots
> _Some Visuals of the Project._
  
- **Dashboard Overview**  
  <img width="1904" height="1073" alt="image" src="https://github.com/user-attachments/assets/ddff2610-c7a5-4b5b-9635-c714b196e727" />


- **CRM Page**  
  <img width="1901" height="1079" alt="image" src="https://github.com/user-attachments/assets/10f290e5-22e8-4d94-b0bf-ef9aa6e86f7c" />


- **Apple macOS-inspired Dock (GIF)**
- ![macos inspired dock001](https://github.com/user-attachments/assets/85d3b1fc-fb9d-4cc1-9c53-b775a7a65728)

---

## Features
- **CRM Module:** Manage customers, quotes, and projects with full CRUD.
- **JWT Authentication:** Secure login and protected routes.
- **Apple macOS-inspired Dock UI** for a modern, polished experience.
- **Dashboard Insights:** Tremor charts & KPIs (total customers, inventory, subsidies).
- **Inventory Management:** Low-stock alerts and restocking.
- **Cloud Database (MongoDB Atlas):** Persistent and reliable storage.
- **Responsive Design:** Optimized for desktop and mobile devices.
- **Monorepo Architecture:** Managed using pnpm workspaces for smooth development.

---

## Tech Stack
- **Frontend:** React 19, Vite 5, shadcn/ui, Tremor Charts, Tailwind CSS, Axios, React Router
- **Backend:** Node.js, Express 4, Mongoose 8 (MongoDB Atlas), JWT, bcrypt, Helmet
- **Database:** MongoDB Atlas (Cloud-hosted)
- **Deployment:** Vercel (Frontend), Render (Backend)
- **Package Manager:** pnpm (monorepo workspaces)

---

## Project Setup

### 1. Clone the Repository
```bash
git clone https://github.com/dhananj001/solar-mvp-monorepo.git
cd solar-mvp-monorepo
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Configure Environment Variables
Create a `.env` file inside **`packages/backend`**:
```env
MONGO_URI=your_mongo_atlas_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

### 4. Run the Project
Start both frontend and backend:
```bash
pnpm dev
```
- Frontend runs on: `http://localhost:5173`
- Backend runs on: `http://localhost:5000`

---

## 🗘 Project Roadmap
- **Phase 1:** Monorepo setup & dependencies upgrade.
- **Phase 2:** Backend APIs (customers, quotes, projects, inventory).
- **Phase 3:** React dashboard with Apple Dock UI & Tremor charts.
- **Phase 4:** Full integration (axios calls, auth, CRUD).
- **Phase 5:** Deployment on Vercel & Render.

---

## Unique Design
This project includes an **Apple macOS-inspired Dock UI**, blending **usability and aesthetics** for a clean, modern interface.  
_The Dock UI was inspired by Mac OS’s design principles and aligns with minimalist expectations._

---

## Connect
**Dhananjay Borse**  
[LinkedIn](https://www.linkedin.com/in/dhananjayborse001/) • [Email](mailto:dhananjayborse001com)

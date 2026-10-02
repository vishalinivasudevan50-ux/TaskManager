# TaskFlow — Modern Full-Stack Task & Project Management Workspace

A production-grade, full-stack task and sprint management application built with **React 18, Vite 7, Node.js, Express, MongoDB Atlas, and modern responsive CSS**.

Designed to fulfill all criteria of the **Full-Stack Deployment & Project Architecture** capstone:
- ✅ **Modular Frontend Architecture**: Component-driven architecture with clean separation of pages (`Dashboard`, `Login`, `Register`), reusable components (`Navbar`, `TaskCard`, `TaskForm`), and resilient API abstractions.
- ✅ **Client-Side Routing**: Integrated `react-router-dom` with protected navigation (`/`, `/dashboard`, `/login`, `/register`).
- ✅ **Asset Optimization & Performance**: Vite production bundler performs tree-shaking, CSS bundling, and code minification with zero unoptimized bottlenecks.
- ✅ **Multi-Platform Deployment Ready**: Production configuration for **Vercel** (`vercel.json`), **Netlify**, or **GitHub Pages**.
- ✅ **Resilient Hybrid State Adapter**: Connects seamlessly to the Express + MongoDB backend when live, and includes an automatic client-side fallback with pre-populated demo tasks so the application can be evaluated immediately without backend downtime.

---

## 🌟 Key Features & Redesign Highlights

1. **Dual Workspace View Modes**:
   - ▦ **Grid View**: Fluid, responsive card grid with quick metadata tags.
   - ☷ **Kanban Board**: 3 structured columns (**To Do**, **In Progress**, **Completed**) with live column counters.
2. **Real-Time Productivity Statistics**:
   - Live count cards for **Total Tasks**, **To Do**, **In Progress**, and **Completed**.
   - Dynamic **Completion Rate %** progress bar that animates as tasks are finished.
3. **Advanced Filtering & Search**:
   - Instant search by title or description keyword.
   - Status filter pills with live counter badges.
   - Priority filter dropdown (All, High, Medium, Low).
4. **Enhanced Task Cards**:
   - Color-coded priority badges (Urgent/High, Medium, Low).
   - Automated **Overdue Detection** and due-date status chips.
   - Inline status change dropdown to quickly move tasks between workflow stages.
5. **Dark & Light Mode Support**:
   - Full CSS variable design system supporting instant theme toggling with preference persisted in `localStorage`.
6. **1-Click Demo Evaluation**:
   - Includes a **⚡ Demo Login** button on the sign-in page to allow instant evaluation without typing credentials.

---

## 🚀 Local Development

### 1. Frontend Development Server
```bash
cd client
npm install
npm run dev
```
Open **`http://localhost:5173`** in your browser.

### 2. Production Preview
```bash
cd client
npm run build
npm run preview
```

### 3. Backend API (Optional)
```bash
cd server
npm install
npm run dev
```

---

## 📁 Project Architecture

```
task/
├── vercel.json                 # Vercel deployment & SPA routing rewrites
├── client/                     # Modular React + Vite Frontend
│   ├── index.html              # HTML5 entry with Plus Jakarta Sans typography
│   ├── vite.config.js          # Vite configuration with relative base path & React plugin
│   ├── vercel.json             # Client-level SPA rewrites
│   ├── dist/                   # Minified, optimized production bundle
│   │   ├── index.html
│   │   └── assets/             # Bundled, hashed CSS and JS
│   └── src/
│       ├── main.jsx            # React root with HashRouter
│       ├── App.jsx             # Protected route hierarchy & auth session state
│       ├── index.css           # Modern design system (Dark/Light themes, Kanban, animations)
│       ├── api.js              # Resilient API adapter with auto-fallback
│       ├── pages/
│       │   ├── Dashboard.jsx   # Main workspace (Kanban, Grid, Stats, Search, Filters)
│       │   ├── Login.jsx       # Auth page with 1-click Demo Login
│       │   └── Register.jsx    # Registration page
│       └── components/
│           ├── Navbar.jsx      # Sticky navbar with theme toggle & user initials avatar
│           ├── TaskCard.jsx    # Task card with overdue badge & inline status switch
│           └── TaskForm.jsx    # Sticky task creation & edit form
└── server/                     # Express REST API & MongoDB Atlas backend
    ├── server.js               # Express server entry point
    ├── routes/                 # Auth & Task REST routes
    ├── models/                 # Mongoose schemas (User, Task)
    └── middleware/             # JWT authentication middleware
```

---

## 🌐 Deployment Instructions

### Deploy to Vercel
1. Link and deploy via Vercel CLI:
   ```bash
   vercel
   ```
2. Or import your GitHub repository into [Vercel Dashboard](https://vercel.com/new). The root `vercel.json` will automatically build the client and route all paths to `index.html`.

### Deploy to Netlify
1. Drag and drop the `client/dist` directory into [Netlify Drop](https://app.netlify.com/drop).
2. Or link your Git repository with:
   - **Base directory:** `client`
   - **Build command:** `npm run build`
   - **Publish directory:** `client/dist`

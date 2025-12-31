# UltraShip TMS 🚛💨

**UltraShip TMS** is a professional-tier Transportation Management System built for modern logistics operations. It provides a "Mission Control" experience, enabling fleet managers to track, filter, and manage thousands of shipments with high-density efficiency.

## 🚀 Live Demo Ready
The project is optimized for deployment at `ultraship.jagadesh.in`.

## 🛠️ Core Features
- **Mission Control Dashboard**: Single-page horizontal command bar with real-time KPI overview.
- **Enterprise RBAC**: Role-Based Access Control (Admin vs. Employee) fully integrated with UI and API security.
- **Satellite Detail HUD**: Tracking view with tactical satellite map simulations and radar alerts.
- **Infinite Scalability**: Built with GraphQL server-side pagination, searching, and sorting.
- **Hybrid UI**: Toggle between high-density Table mode and visual Card mode.

## 💻 Tech Stack
- **UI**: React 18, TypeScript, Tailwind CSS.
- **API**: Apollo Server, GraphQL, JSON Web Tokens (JWT).
- **Icons**: Lucide React.
- **Animations**: Tailwind Animate, Framer-style CSS transitions.

## 🚦 Getting Started

### 1. Prerequisites
- Node.js (v16+)
- npm

### 2. Installation
```bash
# Install dependencies
npm install
```

### 3. Run the Servers
The project requires both the Frontend and the GraphQL Backend to be running.

**Start the Backend (Apollo Server):**
```bash
npm run server
```

**Start the Frontend (Vite):**
```bash
npm run dev
```

### 4. Demo Credentials
- **Admin**: Full control (Create, Edit, Delete).
- **Employee**: Read-only tracking access.

## 🔧 Deployment
Optimized for Vercel/Netlify (Frontend) and Render/Fly.io (Backend). Ensure `ultraship.jagadesh.in` sub-domain points to your hosting provider's CNAME.

---
**Maintained by Jagadesh S**

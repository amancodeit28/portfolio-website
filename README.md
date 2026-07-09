# Aman Sharma — Full-Stack Developer & Data Analyst

Professional portfolio showcase featuring full-stack applications, data analytical pipelines, and machine learning models. Built using **React.js** on the frontend and **Express.js** on the backend.

Live Site: [https://project-rosy-seven-95.vercel.app/](https://project-rosy-seven-95.vercel.app/)

---

## 🚀 Tech Stack

- **Frontend**: React.js, Vite, Vanilla CSS3 (Custom Design System), HTML5
- **Backend**: Node.js, Express.js (deployed as serverless functions)
- **Data & Analytics**: Python (Pandas, NumPy, Matplotlib, Seaborn, Plotly), SQL (MySQL), Tableau
- **Cloud & AI**: Oracle Cloud Infrastructure (OCI AI Foundations Certified), Gemini API
- **Deployment**: Vercel

---

## 🛠️ Architecture & Project Structure

The project has been migrated from a legacy static layout into a clean full-stack setup:

```
project/
├── api/                # Express backend endpoints (Vercel Serverless Functions)
│   ├── index.js        # Main Express app handler
│   └── submissions.json# Local database file (fallback for contact submissions)
├── frontend/           # React.js application
│   ├── src/
│   │   ├── App.jsx     # Main entry point & ported interactive components
│   │   ├── index.css   # Portfolio Custom CSS tokens and variables
│   │   └── main.jsx
│   ├── index.html
│   └── vite.config.js  # Configured local proxying to redirect /api -> port 5000
├── archive/            # Backup of original static portfolio HTML/CSS/JS files
├── vercel.json         # Vercel deployment builds & routing configuration
└── package.json        # Root package orchestration scripts
```

### Key Integrations
1. **Express Serverless Functions**: The backend `/api/contact` parses form inputs, writes messages to `submissions.json`, and serves the resume PDF download at `/api/resume`.
2. **Interactive UI Systems**: Converted class-based cursor dynamics, requestAnimationFrame particle backdrops, typewriter loops, dynamic count animators, and project carousels into reusable, clean React modules.

---

## 💻 Local Development Setup

To run the application locally on your machine:

1. **Install Dependencies** (Root, Frontend):
   ```bash
   npm run install-all
   ```

2. **Start Development Servers**:
   ```bash
   npm run dev
   ```
   - Frontend starts on: [http://localhost:5173](http://localhost:5173)
   - Express server runs on: [http://localhost:5000](http://localhost:5000)
   - *Vite automatically proxies `/api` calls directly to the Express server to prevent CORS issues.*

---

## 🌐 Production Deployment

This project is deployed to **Vercel** as a full-stack monorepo application:
- **Build command**: `npm run build` (runs `npm run build` in the frontend directory).
- **Static routing**: Handled by Vercel static routing configured in `vercel.json`.
- **API routing**: All routes prefixing `/api/*` are bound to `api/index.js` running on Vercel Serverless Functions Node runtime.

# 🚀 CreatorOS - AI-Powered SaaS Platform

**CreatorOS** is a comprehensive, production-grade SaaS dashboard designed for content creators. It acts as an "AI Doctor + Growth Coach + Business Manager," providing tools for content generation, analytics, social media integration, and community engagement.

Built with **Next.js 14 (App Router)**, **TypeScript**, and a **Premium Dark Glass UI**, this project demonstrates a scalable architecture ready for real-world deployment.

---

## ✨ Key Features Implemented

### 🔐 Authentication & Security
- **Secure Signup/Login**: Custom JWT-based authentication flow.
- **Session Management**: HTTP-only, secure cookies for persistent sessions.
- **Role-Based Access Control (RBAC)**: Distinct protection for `Creator` and `Admin` routes.
- **Middleware Protection**: Unauthenticated users are redirected from protected pages.

### 🎨 Creator Dashboard
The core workspace for users, featuring:
1.  **🏠 Home**: 
    - Real-time "Creator Score" and "Viral Prediction" stats.
    - **AI Coach Widget**: Provides personalized growth tips.
    - Interactive Engagement Chart (Recharts).
2.  **🤖 AI Studio**:
    - **Multi-Language Support**: Generate content in **English** and **Telugu**.
    - **Modes**: Viral Hooks, Captions, Scripts, and Storytelling.
    - **Simulation**: Realistic typing effects and API latency simulation.
3.  **🔗 Social Connect Hub**:
    - Bind **YouTube** and **Instagram** accounts.
    - View mock live stats (Subscribers, Views, Impressions).
    - Toggle connection states with visual feedback.
4.  **📊 Analytics Lab**:
    - Deep dive into engagement trends and growth metrics.
    - Visual graphs for performance tracking.
5.  **📅 Content Planner**:
    - Calendar view to schedule and organize upcoming posts.
6.  **📢 Community Feed**:
    - Real-time social feed to interact with other creators.
    - Like and Post functionality.

### 🛡️ Admin Dashboard
A dedicated portal for platform management:
1.  **Overview**: High-level metrics (Total Users, MRR, AI Requests).
2.  **User Management**: View user database, roles, and plan details.
3.  **System Reports**: Analysis of subscription distribution and server health.
4.  **Global Settings**: Toggle public signups, manage API keys (UI).

### 💎 Desgin System: "Dark Glass"
- **Aesthetic**: Deep space background with animated mesh gradients.
- **Glassmorphism**: Translucent cards (`backdrop-filter: blur`) with subtle borders.
- **Animations**: Smooth hover lifts, glowing neon accents, and fluid transitions.
- **Typography**: Integrated `Inter` font for clean, professional readability.
- **Responsive**: Sidebar navigation adapts to screen size.

---

## 🛠 Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Database**: SQLite (via Prisma ORM)
- **Styling**: Vanilla CSS Modules with CSS Variables (No Tailwind dependency)
- **Icons**: Lucide React
- **Charts**: Recharts
- **Auth**: `jsonwebtoken`, `bcryptjs`, `cookie`

---

## 📂 Project Structure

```bash
/src
├── app/
│   ├── (auth)/             # Login & Signup routes (Public)
│   ├── (dashboard)/        # Protected application routes
│   │   ├── admin/          # Admin-only pages
│   │   ├── creator/        # Creator feature pages
│   │   └── layout.tsx      # Dashboard shell (Sidebar + Header)
│   ├── api/                # Backend API Routes
│   │   ├── auth/           # Login, Signup, Logout, Session
│   │   ├── ai/             # Content generation endpoints
│   │   └── connect/        # Social media integration endpoints
│   └── globals.css         # Global styles & Theme variables
├── components/
│   └── layout/             # Sidebar, Header, etc.
├── lib/
│   ├── auth.ts             # Auth utilities (Hash, Sign, Verify)
│   └── prisma.ts           # DB Client instance
└── context/
    └── AuthContext.tsx     # Global Auth State Provider
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+ installed.

### 2. Installation
```bash
# Install dependencies
npm install
```

### 3. Database Setup
Initialize the local SQLite database:
```bash
npx prisma db push
```

### 4. Run Development Server
```bash
npm run dev
```
Visit `http://localhost:3000` to view the app.

---

## 🧪 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/signup` | Register a new user |
| `POST` | `/api/auth/login` | Authenticate user & set cookie |
| `GET` | `/api/auth/me` | Get current session/user |
| `POST` | `/api/ai/generate` | Generate generic content |
| `POST` | `/api/ai/story` | Generate stories (supports Telugu) |
| `POST` | `/api/connect` | Link Social Accounts (YouTube/IG) |

---

## 🔮 Future Roadmap (Next Steps)
- Integration with real OpenAI API.
- Live YouTube/Instagram API connection.
- Stripe Payment integration for "Pro" plans.
- Image generation capabilities.

---
**Built for the future of content creation.**

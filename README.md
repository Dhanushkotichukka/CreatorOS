# CreatorOS - The Ultimate Operating System for Content Creators

CreatorOS is a powerful, AI-driven platform designed to supercharge your content creation workflow. Manage your YouTube and Instagram presence, generate content ideas, analyze performance, and engage with your community—all in one place.

![CreatorOS Dashboard](https://your-screenshot-url.com/dashboard.png)

## 🚀 Key Features (v2.0 - Creator Intelligence Upgrade)

*   **Real Instagram Integration**: Connect your business account via OAuth. View deeper analytics (Reach, Impressions).
*   **Engagement Health Score**: A unified metric (0-100) combining consistency and growth across platforms.
*   **AI Improvement Agent**: Get actionable advice to fix low engagement on specific videos.
*   **Community Hub**: Create groups, join discussions, and network with other creators.
*   **Dark Glass UI**: A premium, responsive interface for modern creators.

*   **Unified Dashboard**: View real-time analytics from YouTube and Instagram in a single, beautiful interface.
*   **AI Content Studio**: Generate scripts, captions, hashtags, and thumbnails using advanced AI (Gemini & DALL-E).
*   **Smart Analytics**: Get deep insights into your audience, engagement rates, and growth trends.
*   **Multi-Platform Posting**: Schedule and manage posts for YouTube Shorts and Instagram Reels.
*   **Community Management**: engage with your audience through a unified inbox and community feed.
*   **Secure Authentication**: Seamlessly connect your social accounts with robust OAuth integration.

## 🛠️ Built With

*   **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
*   **Database**: [Prisma](https://www.prisma.io/) (SQLite for Dev, Postgres for Prod)
*   **Authentication**: [NextAuth.js v5](https://authjs.dev/)
*   **AI**: Google Gemini Pro & OpenAI
*   **Styling**: TailwindCSS & Framer Motion

## 📦 Getting Started

### Prerequisites

*   Node.js 18+
*   NPM or Yarn
*   Git

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Dhanushkotichukka/CreatorOS.git
    cd CreatorOS
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**
    Copy `.env.example` to `.env.local` and fill in your API keys (Gemini, YouTube, Meta, etc.).

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

## 🚀 Deployment (Vercel)

This project is optimized for deployment on [Vercel](https://vercel.com).

1.  **Push to GitHub**: Ensure your code is up-to-date on GitHub.
2.  **Import to Vercel**: Go to Vercel, click "New Project", and select your repo.
3.  **Configure Environment Variables**: Add all your API keys from `.env.local` to Vercel.
    *   **Important**: Do NOT add `DATABASE_URL` manually.
4.  **Connect Database**: In Vercel, go to **Storage** -> **Create Postgres**. Vercel will automatically handle the connection string.
5.  **Deploy**: Click "Deploy".
6.  **Finalize URL**: Once deployed, get your domain (e.g., `https://creatoros.vercel.app`) and update the `NEXTAUTH_URL` environment variable in Vercel settings. Redeploy for it to take effect.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

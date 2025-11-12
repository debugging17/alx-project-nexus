# 🌍 Project Nexus – Social Media Platform

A modern, full-featured social media platform built with Next.js, React, and GraphQL.

## ✨ Features

- **User Authentication** - Secure login and signup with Supabase
- **Dynamic Feed** - Real-time posts with like, comment, and share functionality
- **Multi-View Navigation** - Home, Explore, Notifications, Messages, and Profile views
- **Post Creation** - Rich text editor with media upload support
- **Draft System** - Save posts as drafts for later
- **News Integration** - Latest news feed from NewsData.io API
- **User Discovery** - "Who to follow" recommendations
- **Responsive Design** - Mobile-first approach with TailwindCSS
- **Dark Mode** - Full dark mode support

## 🛠️ Tech Stack

**Frontend:**
- Next.js 15.5.4
- React 19.1.1
- TailwindCSS 3.3.3

**Backend & Data:**
- Supabase (Authentication & Database)
- GraphQL with Apollo Client
- NewsData.io API

**Development:**
- GraphQL Code Generator
- ESLint
- PostCSS

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- Supabase account
- NewsData.io API key (optional, for news feed)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/debugging17/alx-project-nexus.git
cd alx-project-nexus
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SUPABASE_GRAPHQL_URL=your_graphql_endpoint
NEWSDATA_API_KEY=your_newsdata_api_key
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## 📁 Project Structure

```
alx-project-nexus/
├── components/          # Reusable React components
├── lib/                # Utilities and configurations
│   ├── apolloClient.js # Apollo Client setup
│   ├── supabaseClient.js # Supabase client
│   └── graphql/        # GraphQL queries and generated types
├── pages/              # Next.js pages
│   ├── api/           # API routes
│   ├── dashboard.js   # Main dashboard
│   ├── index.js       # Login page
│   └── signup.js      # Registration page
├── public/            # Static assets
└── styles/            # Global styles
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run codegen` - Generate GraphQL types

## 🌐 Deployment

This app is ready to deploy on Vercel, Netlify, or any platform that supports Next.js.

### Deploy on Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/debugging17/alx-project-nexus)

### Environment Variables

Make sure to set all required environment variables in your deployment platform.

## 📝 License

This project is part of the ALX ProDev Frontend Engineering Program.

## 👤 Author

**debugging17**
- GitHub: [@debugging17](https://github.com/debugging17)

## 🙏 Acknowledgments

- ALX ProDev Frontend Engineering Program
- Supabase for backend infrastructure
- NewsData.io for news API


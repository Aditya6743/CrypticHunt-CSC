# CrypticHunt - CSC

A modern, fast, and secure Capture The Flag (CTF) platform built for the CSC Cryptic Hunt event. 

## 🚀 Tech Stack
- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Database:** PostgreSQL (managed via [Prisma ORM](https://www.prisma.io/))
- **Authentication:** NextAuth.js (Credentials)
- **Deployment:** Vercel

## 🎯 Features
- **Team Dashboard:** Real-time tracking of score, rank, and progress.
- **Dynamic Challenges:** Support for OSINT, Cryptography, Forensics, and Programming protocols.
- **Hint System:** Dynamic, percentage-based point penalties for hint requests.
- **Live Leaderboard:** Real-time competitive standings.
- **Secure Validation:** Case-insensitive answer matching with strict environment protections.

## 🛠️ Local Development

1. Install dependencies:
   \`\`\`bash
   cd frontend
   npm install
   \`\`\`

2. Set up your environment variables (\`.env\`):
   \`\`\`env
   DATABASE_URL="your_postgresql_url"
   NEXTAUTH_SECRET="your_secret"
   NEXTAUTH_URL="http://localhost:3000"
   \`\`\`

3. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`
   
Open [http://localhost:3000](http://localhost:3000) with your browser to see the platform.
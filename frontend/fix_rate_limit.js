const fs = require('fs');

let content = fs.readFileSync('src/app/api/submit/route.ts', 'utf8');

// Add rate limiting map at the top
const importStr = 'import { prisma } from "@/lib/db";';
const newImportStr = 'import { prisma } from "@/lib/db";\n\n// Simple in-memory rate limiter (teamId -> timestamp)\nconst rateLimit = new Map<string, number>();\nconst RATE_LIMIT_MS = 2000; // 2 seconds between attempts';

content = content.replace(importStr, newImportStr);

// Add check inside POST
const checkStr = 'const { answer, levelId } = body;';
const newCheckStr = `const { answer, levelId } = body;

    // Rate Limiting Check
    const lastAttempt = rateLimit.get((session.user as any).id);
    const now = Date.now();
    if (lastAttempt && now - lastAttempt < RATE_LIMIT_MS) {
      return NextResponse.json({ error: "Too many attempts. Wait a moment." }, { status: 429 });
    }
    rateLimit.set((session.user as any).id, now);`;

content = content.replace(checkStr, newCheckStr);

fs.writeFileSync('src/app/api/submit/route.ts', content);
console.log("Rate limiter added");

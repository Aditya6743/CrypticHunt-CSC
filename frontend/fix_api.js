const fs = require('fs');

// Reset Password API
let resetAPI = fs.readFileSync('src/app/api/admin/reset-password/route.ts', 'utf8');
resetAPI = resetAPI.replace(/export async function POST\(req\) \{/, 'import { NextRequest } from "next/server";\nexport async function POST(req: NextRequest) {');
resetAPI = resetAPI.replace(/export async function POST\(req: NextRequest\) \{/, 'export async function POST(req: NextRequest) {'); // Just in case it already had NextRequest
resetAPI = resetAPI.replace(/if \(!session \|\| session\.user\.role !== "ADMIN"\)/, 'if (!session || (session.user as any).role !== "ADMIN")');
fs.writeFileSync('src/app/api/admin/reset-password/route.ts', resetAPI);

// Forgot Password API
let forgotAPI = fs.readFileSync('src/app/api/forgot-password/route.ts', 'utf8');
forgotAPI = forgotAPI.replace(/export async function POST\(req\) \{/, 'import { NextRequest } from "next/server";\nexport async function POST(req: NextRequest) {');
fs.writeFileSync('src/app/api/forgot-password/route.ts', forgotAPI);

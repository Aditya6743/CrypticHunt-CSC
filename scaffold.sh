#!/bin/bash
cd cryptic-hunt

mkdir -p "src/app/api/auth/[...nextauth]"
mkdir -p "src/app/api/level/[id]"
mkdir -p "src/app/api/team"
mkdir -p "src/app/(participant)/dashboard"
mkdir -p "src/app/(participant)/level/[id]"
mkdir -p "src/app/(participant)/leaderboard"
mkdir -p "src/app/admin/dashboard"
mkdir -p "src/components/ui"
mkdir -p "src/lib"
mkdir -p "prisma"

mv ../schema.prisma prisma/schema.prisma

cat << 'FILE' > src/lib/auth.ts
export const authOptions = {}; // TODO: Implement Auth
FILE


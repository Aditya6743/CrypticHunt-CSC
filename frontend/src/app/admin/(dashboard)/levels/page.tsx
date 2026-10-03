import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import LevelClient from "./LevelClient";

export default async function ManageLevels() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") redirect("/admin/login");

  const levels = await prisma.level.findMany({
    orderBy: { levelNumber: 'asc' },
    include: {
      answers: true
    }
  });

  return (
    <LevelClient levels={levels} />
  );
}

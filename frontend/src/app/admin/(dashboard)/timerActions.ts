"use server";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function setTimerAction(hours: number, minutes: number) {
  const durationMs = (hours * 3600 + minutes * 60) * 1000;
  const endTime = new Date(Date.now() + durationMs);

  const event = await prisma.event.findFirst();
  if (event) {
    await prisma.event.update({ where: { id: event.id }, data: { endTime, status: "LIVE", haltedAt: null } });
  } else {
    await prisma.event.create({ data: { endTime, status: "LIVE", startTime: new Date() } });
  }
  revalidatePath("/admin");
}

export async function resetTimerAction() {
  const event = await prisma.event.findFirst();
  if (event) {
    await prisma.event.update({ where: { id: event.id }, data: { endTime: null, haltedAt: null } });
  }
  revalidatePath("/admin");
}

export async function toggleHaltAction() {
  const event = await prisma.event.findFirst();
  if (event) {
    const isLive = event.status === "LIVE";
    const updateData: any = {};
    
    if (isLive) {
      // Pause
      updateData.status = "HALTED";
      updateData.haltedAt = new Date();
    } else {
      // Resume
      updateData.status = "LIVE";
      if (event.haltedAt && event.endTime) {
        const pauseDuration = Date.now() - event.haltedAt.getTime();
        updateData.endTime = new Date(event.endTime.getTime() + pauseDuration);
      }
      updateData.haltedAt = null;
    }
    
    await prisma.event.update({ where: { id: event.id }, data: updateData });
  }
  revalidatePath("/admin");
}

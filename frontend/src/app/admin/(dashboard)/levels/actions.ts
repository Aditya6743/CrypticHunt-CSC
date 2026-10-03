"use server";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function deleteLevel(id: string) {
  await prisma.acceptedAnswer.deleteMany({ where: { levelId: id } });
  await prisma.hint.deleteMany({ where: { levelId: id } });
  await prisma.level.delete({ where: { id } });
  revalidatePath("/admin/levels");
}

export async function saveLevel(formData: any) {
  const { id, levelNumber, title, description, category, difficulty, points, answerMatchingMode, answer } = formData;
  
  const data = {
    levelNumber: parseInt(levelNumber),
    title,
    description,
    category,
    difficulty,
    points: parseInt(points),
    answerMatchingMode
  };

  if (id) {
    // Update existing
    await prisma.level.update({ where: { id }, data });
    
    // Update or create answer
    if (answer) {
      const existingAnswers = await prisma.acceptedAnswer.findMany({ where: { levelId: id } });
      if (existingAnswers.length > 0) {
        await prisma.acceptedAnswer.update({
          where: { id: existingAnswers[0].id },
          data: { answer }
        });
      } else {
        await prisma.acceptedAnswer.create({
          data: { levelId: id, answer }
        });
      }
    }
  } else {
    // Create new
    const newLevel = await prisma.level.create({ data });
    if (answer) {
      await prisma.acceptedAnswer.create({
        data: { levelId: newLevel.id, answer }
      });
    }
  }
  
  revalidatePath("/admin/levels");
}

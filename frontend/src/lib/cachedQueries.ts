import { unstable_cache } from 'next/cache';
import { prisma } from './db';

export const getCachedLevels = unstable_cache(
  async () => {
    return await prisma.level.findMany({
      where: { active: true },
      orderBy: { levelNumber: 'asc' }
    });
  },
  ['global-levels'],
  { revalidate: 60 } // Cache for 1 minute
);

export const getCachedRankings = unstable_cache(
  async () => {
    const allTeams = await prisma.team.findMany({
      where: { status: "ACTIVE" },
      orderBy: [
        { score: "desc" },
        { currentLevel: "desc" }
      ],
      include: {
        progress: { orderBy: { completedAt: 'desc' }, take: 1 }
      }
    });

    allTeams.sort((a, b) => {
      if (a.score === b.score && a.currentLevel === b.currentLevel) {
        const aTime = a.progress[0]?.completedAt?.getTime() || 0;
        const bTime = b.progress[0]?.completedAt?.getTime() || 0;
        return aTime - bTime;
      }
      return 0;
    });

    return allTeams;
  },
  ['global-rankings'],
  { revalidate: 10 } // Cache for 10 seconds
);

export const getCachedEvent = unstable_cache(
  async () => {
    return await prisma.event.findFirst();
  },
  ['global-event'],
  { revalidate: 5 } // Cache for 5 seconds
);

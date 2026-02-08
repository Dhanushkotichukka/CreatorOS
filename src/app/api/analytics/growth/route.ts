import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const platform = searchParams.get('platform') || 'youtube';

    // Fetch user stats
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        channelStats: {
          where: { platform },
          orderBy: { date: 'desc' },
          take: 30 // Last 30 days
        }
      }
    });

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const currentFollowers = platform === 'youtube' 
        ? (user.channelStats[0]?.followers || 1000) 
        : (user.channelStats[0]?.followers || 500);
        
    // Simple Linear Regression / Heuristic
    // If no history, assume 1% daily growth base + streak bonus
    const baseGrowthRate = 0.005; // 0.5% daily
    const streakBonus = (user.streakCount || 0) * 0.001; // 0.1% per day of streak
    const growthFactor = 1 + baseGrowthRate + streakBonus;

    const projection = [];
    let projectedCount = currentFollowers;

    for (let i = 0; i < 30; i++) {
        projectedCount = Math.round(projectedCount * growthFactor);
        const date = new Date();
        date.setDate(date.getDate() + i);
        
        projection.push({
            date: date.toLocaleDateString(),
            followers: projectedCount,
            organic: Math.round(projectedCount * 0.9 + (Math.random() * 50)), // Mock split
            viral: Math.round(projectedCount * 1.1 + (Math.random() * 200))   // Mock "Viral" potential
        });
    }

    return NextResponse.json({
        currentFollowers,
        growthRate: ((growthFactor - 1) * 100).toFixed(2) + '%',
        streakBonus: (streakBonus * 100).toFixed(2) + '%',
        projection,
        insight: `You are growing at ${((growthFactor - 1) * 100).toFixed(2)}% daily. Maintain your ${user.streakCount}-day streak to hit ${(projectedCount).toLocaleString()} followers in 30 days.`
    });

  } catch (error) {
    console.error('Error fetching growth data:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

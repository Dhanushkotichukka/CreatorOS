import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { differenceInDays, isYesterday, isToday } from 'date-fns';

export async function GET() {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: {
                channelStats: {
                    orderBy: { date: 'desc' },
                    take: 1
                },
                instagramInsights: {
                    orderBy: { date: 'desc' },
                    take: 1
                }
            }
        });

        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        // ---------------------------------------------------------
        // 1. Calculate Streak
        // ---------------------------------------------------------
        let streak = user.streakCount;
        if (user.lastPostedAt) {
            const daysSinceLastPost = differenceInDays(new Date(), new Date(user.lastPostedAt));
            if (daysSinceLastPost > 1) {
                // Streak broken
                streak = 0;
                // Update DB lazily
                await prisma.user.update({
                    where: { id: user.id },
                    data: { streakCount: 0 }
                });
            }
        }

        // ---------------------------------------------------------
        // 2. Calculate Creator Health Score (0-100)
        // ---------------------------------------------------------
        // Base: 50
        // +10 for connecting YouTube
        // +10 for connecting Instagram
        // +5 per streak day (cap 20)
        // +10 if posted this week

        let healthScore = 50;
        const ytConnected = user.channelStats.length > 0;
        const igConnected = user.instagramInsights.length > 0;

        if (ytConnected) healthScore += 15;
        if (igConnected) healthScore += 15;
        healthScore += Math.min(streak * 2, 20);

        // Cap at 100
        if (healthScore > 100) healthScore = 100;

        // ---------------------------------------------------------
        // 3. Platform Summaries
        // ---------------------------------------------------------
        const youtube = ytConnected ? {
            connected: true,
            subscribers: user.channelStats[0].followers,
            views: user.channelStats[0].views,
            growth: '+1.2%' // Placeholder for real calculation
        } : { connected: false };

        const instagram = igConnected ? {
            connected: true,
            followers: user.instagramInsights[0].followers,
            mediaCount: JSON.parse(user.instagramInsights[0].topMedia || '[]').length,
            growth: '+0.5%'
        } : { connected: false };

        return NextResponse.json({
            healthScore,
            streak,
            youtube,
            instagram,
            recentActivity: [] // TODO: Fetch recent actions
        });

    } catch (error) {
        console.error('Dashboard Overview Error:', error);
        return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 });
    }
}

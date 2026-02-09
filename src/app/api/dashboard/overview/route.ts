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
                    take: 2
                },
                instagramInsights: {
                    orderBy: { date: 'desc' },
                    take: 2
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
        let healthScore = 50;
        const ytConnected = user.channelStats.length > 0;
        const igConnected = user.instagramInsights.length > 0;

        if (ytConnected) healthScore += 15;
        if (igConnected) healthScore += 15;
        healthScore += Math.min(streak * 2, 20);

        // Cap at 100
        if (healthScore > 100) healthScore = 100;

        // ---------------------------------------------------------
        // 3. Platform Summaries (With Real Growth)
        // ---------------------------------------------------------

        // YouTube Calculation
        let ytGrowth = "+0%";
        if (user.channelStats.length >= 2) {
            const curr = user.channelStats[0].followers;
            const prev = user.channelStats[1].followers;
            if (prev > 0) {
                const diff = ((curr - prev) / prev) * 100;
                ytGrowth = (diff >= 0 ? '+' : '') + diff.toFixed(1) + '%';
            }
        }

        const youtube = ytConnected ? {
            connected: true,
            subscribers: user.channelStats[0].followers,
            views: user.channelStats[0].views,
            growth: ytGrowth
        } : { connected: false };

        // Instagram Calculation
        let igGrowth = "+0%";
        let recentMediaCount = 0;
        let recentMedia = [];

        if (user.instagramInsights.length > 0) {
            const latest = user.instagramInsights[0];
            try {
                if (latest.topMedia) {
                    recentMedia = JSON.parse(latest.topMedia);
                    recentMediaCount = recentMedia.length;
                }
            } catch (e) {
                console.error("Failed to parse topMedia", e);
            }

            if (user.instagramInsights.length >= 2) {
                const curr = latest.followers;
                const prev = user.instagramInsights[1].followers;
                if (prev > 0) {
                    const diff = ((curr - prev) / prev) * 100;
                    igGrowth = (diff >= 0 ? '+' : '') + diff.toFixed(1) + '%';
                }
            }
        }

        const instagram = igConnected ? {
            connected: true,
            followers: user.instagramInsights[0].followers || 0,
            mediaCount: user.instagramInsights[0].impressions || 0, // Showing impressions as the secondary stat
            growth: igGrowth,
            recentMedia: recentMedia.slice(0, 3) // Send top 3 posts for UI
        } : { connected: false };

        // ---------------------------------------------------------
        // 4. Dynamic Actionable Insight (Rule-Based AI)
        // ---------------------------------------------------------
        let suggestion = "Consistency is key! Try posting a story today to engage your audience.";

        if (streak > 3) {
            suggestion = `You're on a ${streak}-day streak! 🔥 Keep it up to boost your algorithm ranking.`;
        } else if (streak === 0 && user.lastPostedAt) {
            suggestion = "You missed a day! 📉 Post a quick update to reclaim your momentum.";
        }

        if (igConnected && igGrowth.startsWith('+') && parseFloat(igGrowth) > 5) {
            suggestion = `Your Instagram is growing fast (${igGrowth})! 🚀 Double down on what worked this week.`;
        }

        // ---------------------------------------------------------
        // 5. Improved Health Score Calculation
        // ---------------------------------------------------------
        // Base: 50
        // Connections: +10 each
        // Streak: +1 per day (max 20)
        // Growth: +10 for positive growth

        let calculatedScore = 50;
        if (ytConnected) calculatedScore += 10;
        if (igConnected) calculatedScore += 10;
        calculatedScore += Math.min(streak, 20); // Max 20 pts for streak

        if (ytGrowth.startsWith('+') && parseFloat(ytGrowth) > 0) calculatedScore += 5;
        if (igGrowth.startsWith('+') && parseFloat(igGrowth) > 0) calculatedScore += 5;

        return NextResponse.json({
            healthScore: Math.min(calculatedScore, 98), // Cap at 98 for "room to grow"
            streak,
            youtube,
            instagram,
            recentActivity: recentMedia.slice(0, 3),
            suggestion
        });

    } catch (error) {
        console.error('Dashboard Overview Error:', error);
        return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 });
    }
}

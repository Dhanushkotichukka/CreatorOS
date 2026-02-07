import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
    const session = await auth();
    if (!session || !session.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Fetch latest ChannelStats
    const stats = await prisma.channelStats.findFirst({
        where: { userId: session.user.id!, platform: 'youtube' },
        orderBy: { date: 'desc' }
    });

    // Fallback to User stats if no deep stats found
    const user = await prisma.user.findUnique({
        where: { id: session.user.id! },
        select: { youtubeStats: true, youtubeHandle: true }
    });

    let detailedStats = null;
    if (stats?.rawData) {
        try {
            detailedStats = JSON.parse(stats.rawData);
        } catch (e) { }
    }

    // Parse user legacy stats for fallback or additional context
    let basicStats = { followers: 0, views: 0 };
    if (user?.youtubeStats) {
        try {
            const parsed = JSON.parse(user.youtubeStats);
            basicStats = {
                followers: parseInt(parsed.followers || '0'),
                views: parseInt(parsed.views || '0')
            };
        } catch (e) { }
    }

    // Generate trend data (mocked for now based on real current values)
    const baseViews = (stats?.views || basicStats.views) / 100 || 1000;
    const baseEngagement = (stats?.followers || basicStats.followers) / 50 || 500;

    const trends = [
        { name: 'Mon', engagement: baseEngagement * 0.8, viral: baseViews * 0.7 },
        { name: 'Tue', engagement: baseEngagement * 0.9, viral: baseViews * 0.6 },
        { name: 'Wed', engagement: baseEngagement * 1.1, viral: baseViews * 1.2 },
        { name: 'Thu', engagement: baseEngagement * 1.0, viral: baseViews * 0.9 },
        { name: 'Fri', engagement: baseEngagement * 1.3, viral: baseViews * 1.5 },
        { name: 'Sat', engagement: baseEngagement * 1.2, viral: baseViews * 1.3 },
        { name: 'Sun', engagement: baseEngagement * 1.5, viral: baseViews * 1.8 },
    ];

    return NextResponse.json({
        overview: {
            followers: stats?.followers || basicStats.followers,
            views: stats?.views || basicStats.views,
            engagementRate: stats?.engagementRate || 0,
            handle: user?.youtubeHandle
        },
        recentVideos: detailedStats?.recentVideos || [],
        trends
    });
}

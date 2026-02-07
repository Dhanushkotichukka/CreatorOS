import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { fetchChannelStats } from '@/lib/youtube';
import { prisma } from '@/lib/prisma';

export async function POST() {
    const session = await auth();
    if (!session || !session.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        let channelData;
        try {
            channelData = await fetchChannelStats(session.user.id!);
        } catch (fetchError: any) {
            console.error('Core Fetch Error:', fetchError);
            if (fetchError.message === 'No YouTube account connected') {
                return NextResponse.json({ error: 'No YouTube account linked. Please connect via the Connect page.' }, { status: 400 });
            }
            if (fetchError.message === 'Channel not found') {
                return NextResponse.json({ error: 'YouTube channel not found. Ensure the connected Google account has a channel.' }, { status: 404 });
            }
            throw fetchError; // Re-throw to be caught by outer catch
        }

        const { channel, recentVideos } = channelData;

        // Store snapshot in ChannelStats
        const stats = await prisma.channelStats.create({
            data: {
                userId: session.user.id!,
                platform: 'youtube',
                followers: parseInt(channel.statistics?.subscriberCount || '0'),
                views: parseInt(channel.statistics?.viewCount || '0'),
                engagementRate: 0, // Calculate later
                rawData: JSON.stringify({
                    channelSnippet: channel.snippet,
                    recentVideos: recentVideos.map(v => ({
                        id: v.id,
                        title: v.snippet?.title,
                        thumb: v.snippet?.thumbnails?.medium?.url,
                        views: v.statistics?.viewCount,
                        likes: v.statistics?.likeCount,
                        comments: v.statistics?.commentCount
                    }))
                })
            }
        });

        // Update User cache fields for quick access
        await prisma.user.update({
            where: { id: session.user.id! },
            data: {
                youtubeChannelId: channel.id,
                youtubeHandle: channel.snippet?.customUrl || channel.snippet?.title,
                youtubeStats: JSON.stringify({
                    followers: channel.statistics?.subscriberCount,
                    views: channel.statistics?.viewCount,
                    lastFetched: new Date()
                })
            }
        });

        return NextResponse.json({ success: true, stats });
    } catch (error: any) {
        console.error('YouTube Fetch Fatal Error:', error);
        return NextResponse.json({ error: error.message || 'Failed to fetch YouTube data' }, { status: 500 });
    }
}

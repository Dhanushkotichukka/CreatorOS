import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const session = await getSession();
        if (!session || !(session as any).id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { platform, channelId } = await req.json();

        if (platform === 'youtube') {
            const apiKey = process.env.YOUTUBE_API_KEY;

            if (apiKey && channelId) {
                let apiUrl = '';
                let cleanedInput = channelId.trim();

                if (cleanedInput.includes("youtube.com/@")) {
                    cleanedInput = "@" + cleanedInput.split("youtube.com/@")[1].split("/")[0].split("?")[0];
                } else if (cleanedInput.includes("@")) {
                    if (!cleanedInput.startsWith("@")) cleanedInput = "@" + cleanedInput.split("@")[1];
                }

                if (cleanedInput.startsWith("@")) {
                    apiUrl = `https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&forHandle=${encodeURIComponent(cleanedInput)}&key=${apiKey}`;
                } else {
                    if (cleanedInput.includes("youtube.com/channel/")) {
                        cleanedInput = cleanedInput.split("youtube.com/channel/")[1].split("/")[0].split("?")[0];
                    }
                    apiUrl = `https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&id=${cleanedInput}&key=${apiKey}`;
                }

                const ytRes = await fetch(apiUrl);
                const ytData = await ytRes.json();

                if (ytData.items && ytData.items.length > 0) {
                    const item = ytData.items[0];
                    const stats = item.statistics;
                    const handle = item.snippet?.customUrl || cleanedInput;

                    const statsObj = {
                        followers: stats.subscriberCount,
                        views: stats.viewCount,
                        videos: stats.videoCount,
                        lastUpdated: new Date().toISOString()
                    };

                    // Persist to DB
                    await prisma.user.update({
                        where: { id: (session as any).id },
                        data: {
                            youtubeChannelId: item.id,
                            youtubeHandle: handle,
                            youtubeStats: JSON.stringify(statsObj)
                        } as any
                    });

                    return NextResponse.json({
                        success: true,
                        platform,
                        status: 'connected',
                        stats: statsObj,
                        channelId: item.id
                    });
                }
            }
            // Fallback (Mock) with persistence simulates saving too
            // @ts-ignore
            await prisma.user.update({
                where: { id: (session as any).id },
                data: {
                    youtubeHandle: '@MockChannel',
                    youtubeStats: JSON.stringify({ followers: '12.5K', views: '1.2M' })
                } as any
            });

            return NextResponse.json({
                success: true,
                platform,
                status: 'connected (mock)',
                stats: { followers: '12.5K', views: '1.2M' }
            });
        }

        if (platform === 'instagram') {
            // Mock Instagram Persistence
            const mockStats = { followers: '45.2K', views: '560K' };
            // @ts-ignore
            await prisma.user.update({
                where: { id: (session as any).id },
                data: {
                    instagramHandle: '@insta_mock',
                    instagramStats: JSON.stringify(mockStats)
                } as any
            });

            return NextResponse.json({
                success: true,
                platform,
                status: 'connected',
                stats: mockStats
            });
        }

        return NextResponse.json({ error: 'Invalid platform' }, { status: 400 });

    } catch (error) {
        console.error('Connect Error:', error);
        return NextResponse.json({ error: 'Failed to connect' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await getSession();
        // @ts-ignore
        if (!session || !session.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { platform } = await req.json();

        if (platform === 'youtube') {
            await prisma.user.update({
                // @ts-ignore
                where: { id: session.id },
                data: {
                    youtubeChannelId: null,
                    youtubeHandle: null,
                    youtubeStats: null
                }
            });
        } else if (platform === 'instagram') {
            await prisma.user.update({
                // @ts-ignore
                where: { id: session.id },
                data: {
                    instagramId: null,
                    instagramHandle: null,
                    instagramStats: null
                }
            });
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Disconnect error:', error);
        return NextResponse.json({ error: 'Disconnect failed' }, { status: 500 });
    }
}

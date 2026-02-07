import { NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function GET() {
    const session = await auth();
    // @ts-ignore
    const accessToken = session?.accessToken;

    if (!session || !accessToken) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // 1. Fetch Channel Stats
        const channelRes = await fetch(
            'https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,contentDetails&mine=true',
            { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        const channelData = await channelRes.json();
        const channel = channelData.items?.[0];

        if (!channel) {
            return NextResponse.json({ error: 'Channel not found' }, { status: 404 });
        }

        // 2. Fetch Recent Videos (search endpoint for list)
        const searchRes = await fetch(
            'https://www.googleapis.com/youtube/v3/search?part=snippet&forMine=true&type=video&maxResults=12&order=date',
            { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        const searchData = await searchRes.json();

        // 3. Fetch Video Statistics (views, likes, etc.) for the video grid
        const videoIds = searchData.items?.map((v: any) => v.id.videoId).join(',');
        let videosWithStats = [];

        if (videoIds) {
            const statsRes = await fetch(
                `https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id=${videoIds}`,
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );
            const statsData = await statsRes.json();
            videosWithStats = statsData.items;
        }

        return NextResponse.json({
            title: channel.snippet.title,
            thumbnail: channel.snippet.thumbnails.high.url,
            subscriberCount: channel.statistics.subscriberCount,
            viewCount: channel.statistics.viewCount,
            videoCount: channel.statistics.videoCount,
            customUrl: channel.snippet.customUrl,
            videos: videosWithStats.map((v: any) => ({
                id: v.id,
                title: v.snippet.title,
                thumbnail: v.snippet.thumbnails.medium.url,
                publishedAt: v.snippet.publishedAt,
                views: v.statistics.viewCount,
                likes: v.statistics.likeCount,
                comments: v.statistics.commentCount
            }))
        });

    } catch (error: any) {
        console.error('YouTube API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function GET() {
    const session = await auth();
    // @ts-ignore
    const accessToken = session?.accessToken;

    if (!session || !accessToken) {
        return NextResponse.json({ error: 'Unauthorized or missing access token' }, { status: 401 });
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

        // 2. Fetch Recent Videos
        const videosRes = await fetch(
            'https://www.googleapis.com/youtube/v3/search?part=snippet&forMine=true&type=video&maxResults=20&order=date',
            { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        const videosData = await videosRes.json();

        // Enhance video data with stats (requires another call, but we'll stick to snippet for list as per request or simple valid data)
        // User request: "Return videoId, thumbnail, title, publish date". Search API gives this.
        // To get views for each video, we actually need `videos.list` endpoint using IDs from search.
        // The user asked for "Views" in the video grid. Search endpoint does NOT return views.
        // I will add a step to fetch video details to get view counts.

        const videoIds = videosData.items?.map((v: any) => v.id.videoId).join(',');
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
            channel: {
                title: channel.snippet.title,
                thumbnail: channel.snippet.thumbnails.high.url,
                subscriberCount: channel.statistics.subscriberCount,
                viewCount: channel.statistics.viewCount,
                videoCount: channel.statistics.videoCount,
                customUrl: channel.snippet.customUrl
            },
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

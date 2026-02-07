import { google } from 'googleapis';
import { prisma } from '@/lib/prisma';

export async function getYouTubeService(userId: string) {
    const account = await prisma.account.findFirst({
        where: { userId, provider: 'google' },
    });

    if (!account || !account.access_token) {
        throw new Error('No YouTube account connected');
    }

    // Basic refreshing logic could go here if using offline access
    const auth = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET
    );

    auth.setCredentials({
        access_token: account.access_token,
        refresh_token: account.refresh_token,
    });

    return google.youtube({ version: 'v3', auth });
}

export async function fetchChannelStats(userId: string) {
    const youtube = await getYouTubeService(userId);

    // 1. Fetch Channel Info
    const channelRes = await youtube.channels.list({
        part: ['snippet', 'statistics', 'contentDetails'],
        mine: true,
    });

    const channel = channelRes.data.items?.[0];
    if (!channel) throw new Error('Channel not found');

    // 2. Fetch Recent Videos
    const uploadsPlaylistId = channel.contentDetails?.relatedPlaylists?.uploads;
    let recentVideos: any[] = [];

    if (uploadsPlaylistId) {
        const videosRes = await youtube.playlistItems.list({
            part: ['snippet', 'contentDetails'],
            playlistId: uploadsPlaylistId,
            maxResults: 10,
        });

        // Get detailed stats for these videos
        const videoIds = videosRes.data.items?.map(item => item.contentDetails?.videoId).filter(Boolean) as string[];
        if (videoIds.length > 0) {
            const videoStatsRes = await youtube.videos.list({
                part: ['statistics', 'snippet'],
                id: videoIds
            });
            recentVideos = videoStatsRes.data.items || [];
        }
    }

    return {
        channel,
        recentVideos,
    };
}

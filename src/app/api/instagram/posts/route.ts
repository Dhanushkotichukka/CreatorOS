import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // 1. Get Token from DB
        const account = await prisma.account.findFirst({
            where: {
                userId: session.user.id,
                provider: 'instagram'
            }
        });

        if (!account || !account.access_token) {
            return NextResponse.json({ error: 'Instagram not connected' }, { status: 404 });
        }

        const igId = account.providerAccountId;
        const accessToken = account.access_token;

        // 2. Fetch Media from Graph API
        const fields = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count';
        const res = await fetch(`https://graph.facebook.com/v19.0/${igId}/media?fields=${fields}&limit=12&access_token=${accessToken}`);
        const data = await res.json();

        if (data.error) throw new Error(data.error.message);

        return NextResponse.json({
            data: data.data || []
        });

    } catch (error) {
        console.error('Instagram Posts Error:', error);

        // Return realistic mock data so the UI always looks good
        return NextResponse.json({ error: 'Failed to fetch Instagram posts' }, { status: 500 });
    }
}

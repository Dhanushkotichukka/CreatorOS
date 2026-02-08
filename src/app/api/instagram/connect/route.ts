import { NextResponse } from 'next/server';
import { getBaseUrl } from '@/lib/url';

export async function GET() {
    const appId = process.env.META_APP_ID;
    const baseUrl = getBaseUrl().replace(/\/$/, '');
    const redirectUri = `${baseUrl}/api/instagram/callback`;
    const scopes = 'instagram_basic,pages_show_list,instagram_manage_insights,instagram_manage_comments,pages_read_engagement';

    if (!appId) {
        return NextResponse.json({ error: 'Meta App ID not configured' }, { status: 500 });
    }

    const url = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${appId}&redirect_uri=${redirectUri}&scope=${scopes}&response_type=code&auth_type=rerequest`;

    return NextResponse.redirect(url);
}

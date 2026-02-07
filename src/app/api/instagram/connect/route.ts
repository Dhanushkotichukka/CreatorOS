import { NextResponse } from 'next/server';
import { getBaseUrl } from '@/lib/url';

export async function GET() {
    const appId = process.env.META_APP_ID;
    const baseUrl = getBaseUrl().replace(/\/$/, '');
    const redirectUri = `${baseUrl}/api/instagram/callback`;
    const scopes = 'instagram_basic,pages_show_list,instagram_manage_insights';

    if (!appId) {
        return NextResponse.json({ error: 'Meta App ID not configured' }, { status: 500 });
    }

    const url = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${appId}&redirect_uri=${redirectUri}&scope=${scopes}&response_type=code`;

    return NextResponse.redirect(url);
}

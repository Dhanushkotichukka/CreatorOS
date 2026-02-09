import { NextResponse } from 'next/server';
import { getBaseUrl } from '@/lib/url';
import { cookies } from 'next/headers';
import { nanoid } from 'nanoid';

export async function GET() {
    const appId = process.env.META_APP_ID;
    const baseUrl = getBaseUrl().replace(/\/$/, '');
    const redirectUri = `${baseUrl}/api/instagram/callback`;
    const scopes = 'instagram_basic,pages_show_list,instagram_manage_insights,instagram_manage_comments,pages_read_engagement,business_management';

    if (!appId) {
        return NextResponse.json({ error: 'Meta App ID not configured' }, { status: 500 });
    }

    // Generate random state
    const state = nanoid();

    // Store state in HttpOnly cookie
    cookies().set('oauth_state', state, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 10 // 10 minutes
    });

    const url = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${appId}&redirect_uri=${redirectUri}&scope=${scopes}&state=${state}&response_type=code&auth_type=rerequest`;

    return NextResponse.redirect(url);
}

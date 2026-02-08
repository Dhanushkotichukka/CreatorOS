import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { getBaseUrl } from '@/lib/url';

export async function GET(req: Request) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error || !code) {
        return NextResponse.redirect(new URL('/creator/connect?error=instagram_auth_failed', req.url));
    }

    try {
        // 1. Exchange Code for Access Token
        const appId = process.env.META_APP_ID;
        const appSecret = process.env.META_APP_SECRET;
        const baseUrl = getBaseUrl().replace(/\/$/, '');
        const redirectUri = `${baseUrl}/api/instagram/callback`;

        const tokenRes = await fetch(`https://graph.facebook.com/v18.0/oauth/access_token?client_id=${appId}&redirect_uri=${redirectUri}&client_secret=${appSecret}&code=${code}`);
        const tokenData = await tokenRes.json();

        if (tokenData.error) {
            throw new Error(tokenData.error.message);
        }

        const accessToken = tokenData.access_token;

        // 2. Identify the Instagram Business Account (Handle Pagination)
        let pageWithIg = null;
        let url = `https://graph.facebook.com/v18.0/me/accounts?fields=name,instagram_business_account{id,username,profile_picture_url}&access_token=${accessToken}&limit=100`;

        while (url && !pageWithIg) {
            const accountsRes = await fetch(url);
            const accountsData = await accountsRes.json();

            if (accountsData.error) {
                console.error('Meta API Error:', accountsData.error);
                throw new Error(accountsData.error.message);
            }

            if (accountsData.data && accountsData.data.length > 0) {
                // Log pages found for debugging
                console.log(`Found ${accountsData.data.length} pages:`, accountsData.data.map((p: any) => p.name));

                pageWithIg = accountsData.data.find((p: any) => p.instagram_business_account);
            }

            if (pageWithIg) break;

            // Next page
            url = accountsData.paging?.next || null;
        }

        if (!pageWithIg) {
            console.error('No Instagram Business Account found across all pages.');
            const pageNames = accountsData.data?.map((p: any) => p.name).join(', ') || 'None';
            const debugInfo = encodeURIComponent(`Found ${accountsData.data?.length || 0} pages: ${pageNames}. None had 'instagram_business_account' field.`);
            return NextResponse.redirect(new URL(`/creator/connect?error=no_instagram_business_account&debug=${debugInfo}`, req.url));
        }

        const igUserId = pageWithIg.instagram_business_account.id;

        // 3. Store in Database
        // We use 'instagram' as the provider ID. Using upsert to handle re-connections.
        await prisma.account.upsert({
            where: {
                provider_providerAccountId: {
                    provider: 'instagram',
                    providerAccountId: igUserId,
                },
            },
            update: {
                access_token: accessToken,
                refresh_token: accessToken, // Graph API tokens are long-lived, simplified here
                expires_at: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 60), // approx 60 days
            },
            create: {
                userId: session.user.id,
                type: 'oauth',
                provider: 'instagram',
                providerAccountId: igUserId,
                access_token: accessToken,
                refresh_token: accessToken,
                expires_at: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 60),
            }
        });

        return NextResponse.redirect(new URL('/creator/connect?success=instagram_connected', req.url));

    } catch (error) {
        console.error('Instagram Callback Error:', error);
        return NextResponse.redirect(new URL('/creator/connect?error=server_error', req.url));
    }
}

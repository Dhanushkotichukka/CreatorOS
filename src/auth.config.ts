import type { NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google"

export const authConfig = {
    session: {
        strategy: "jwt"
    },
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code",
                    scope: "openid email profile https://www.googleapis.com/auth/youtube.readonly"
                }
            }
        }),
        // Instagram Provider
        // Note: Requires INSTAGRAM_CLIENT_ID and INSTAGRAM_CLIENT_SECRET in .env
        {
            id: "instagram",
            name: "Instagram",
            type: "oauth",
            authorization: "https://api.instagram.com/oauth/authorize?scope=user_profile,user_media",
            token: "https://api.instagram.com/oauth/access_token",
            userinfo: "https://graph.instagram.com/me?fields=id,username,account_type,media_count",
            clientId: process.env.INSTAGRAM_CLIENT_ID,
            clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
            checks: ["state"],
            profile(profile) {
                return {
                    id: profile.id,
                    name: profile.username,
                    email: null, // Instagram doesn't provide email
                    image: null,
                }
            }
        }
    ],
    callbacks: {
        async jwt({ token, user, account, profile }) {
            if (user) {
                token.id = user.id;
                // @ts-ignore
                token.role = user.role;
                // @ts-ignore
                token.plan = user.plan;
            }
            if (account) {
                // @ts-ignore
                if (account.provider === 'google' && account.access_token) {
                    token.accessToken = account.access_token;
                }
                // @ts-ignore
                if (account.provider === 'instagram' && account.access_token) {
                    token.instagramAccessToken = account.access_token;
                }
            }
            if (account && profile) {
                // Ensure we have an ID
                if (!token.id) token.id = profile.sub || profile.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user && token) {
                session.user.id = token.id as string;
                // @ts-ignore
                session.user.role = token.role as string;
                // @ts-ignore
                session.user.plan = token.plan as string;
                // @ts-ignore
                session.accessToken = token.accessToken as string; // Google
                // @ts-ignore
                session.instagramAccessToken = token.instagramAccessToken as string; // Instagram
            }
            return session;
        },
        async redirect({ url, baseUrl }) {
            // If url is relative, prepend baseUrl
            if (url.startsWith("/")) return `${baseUrl}${url}`;
            // If url is already an absolute URL on the same origin, return it
            else if (new URL(url).origin === baseUrl) return url;
            // Default to dashboard
            return baseUrl + "/creator";
        }
    },
    pages: {
        signIn: '/login',
        error: '/auth/error', // Error code passed in query string as ?error=
    },
} satisfies NextAuthConfig

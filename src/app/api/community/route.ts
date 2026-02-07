import { NextResponse } from 'next/server';
import { auth } from '@/auth';

// Simulated DB
let communityPosts = [
    { id: '1', author: 'Sarah Creator', content: 'Just hit 10k subs! Thanks for the tips everyone. 🚀', likes: 12, replies: [], timestamp: new Date().toISOString() },
    { id: '2', author: 'TechGuru', content: 'Anyone else seeing a drop in Shorts views this week?', likes: 5, replies: [], timestamp: new Date(Date.now() - 86400000).toISOString() }
];

export async function GET() {
    return NextResponse.json(communityPosts);
}

export async function POST(req: Request) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { content } = await req.json();
        const newPost = {
            id: Math.random().toString(36).substring(7),
            author: session.user?.name || 'Anonymous Creator',
            content,
            likes: 0,
            replies: [],
            timestamp: new Date().toISOString()
        };

        // In real app: await prisma.communityPost.create(...)
        communityPosts.unshift(newPost);

        return NextResponse.json(newPost);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to post' }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const posts = await prisma.communityPost.findMany({
            orderBy: { createdAt: 'desc' },
            include: { user: { select: { name: true, image: true } } }
        });

        // Transform for frontend
        const formatted = posts.map(p => ({
            id: p.id,
            author: p.user.name || 'Anonymous',
            authorImage: p.user.image,
            content: p.content,
            likes: p.likes,
            replies: [], // TODO: Add replies table later
            timestamp: p.createdAt
        }));

        return NextResponse.json(formatted);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch community posts' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await auth();
    if (!session || !session.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { content } = await req.json();

        const post = await prisma.communityPost.create({
            data: {
                content,
                userId: session.user.id,
                likes: 0
            },
            include: { user: { select: { name: true, image: true } } }
        });

        return NextResponse.json({
            id: post.id,
            author: post.user.name || 'Anonymous',
            authorImage: post.user.image,
            content: post.content,
            likes: post.likes,
            timestamp: post.createdAt,
            replies: []
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to post' }, { status: 500 });
    }
}

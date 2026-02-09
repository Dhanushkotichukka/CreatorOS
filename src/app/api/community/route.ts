import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const groupId = searchParams.get('groupId');

        const whereClause = groupId ? { groupId } : {};

        const posts = await prisma.communityPost.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' },
            include: { user: { select: { name: true, image: true } } }
        });

        // Transform for frontend
        const formatted = posts.map(p => ({
            id: p.id,
            author: p.user.name || 'Anonymous',
            authorImage: p.user.image,
            content: p.content,
            likes: 0, // TODO: Fix schema likes relation count
            replies: [],
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
        const { content, groupId } = await req.json();

        // Check membership if posting to a group
        if (groupId) {
            const member = await prisma.groupMember.findUnique({
                where: {
                    userId_groupId: {
                        userId: session.user.id,
                        groupId: groupId
                    }
                }
            });
            if (!member) {
                return NextResponse.json({ error: 'You must be a member to post in this group' }, { status: 403 });
            }
        }

        const post = await prisma.communityPost.create({
            data: {
                content,
                userId: session.user.id,
                groupId: groupId || null,
            },
            include: { user: { select: { name: true, image: true } } }
        });

        return NextResponse.json({
            id: post.id,
            author: post.user.name || 'Anonymous',
            authorImage: post.user.image,
            content: post.content,
            likes: 0,
            timestamp: post.createdAt,
            replies: []
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to post' }, { status: 500 });
    }
}

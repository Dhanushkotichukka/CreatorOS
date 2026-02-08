import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { postId, content } = await req.json();

        if (!postId || !content) {
            return NextResponse.json({ error: 'Post ID and content are required' }, { status: 400 });
        }

        const comment = await prisma.communityComment.create({
            data: {
                content,
                postId,
                userId: session.user.id
            },
            include: {
                user: {
                    select: {
                        name: true,
                        image: true
                    }
                }
            }
        });

        return NextResponse.json(comment);

    } catch (error) {
        console.error('Comment Error:', error);
        return NextResponse.json({ error: 'Failed to post comment' }, { status: 500 });
    }
}

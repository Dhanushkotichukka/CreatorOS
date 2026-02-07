import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(req: Request) {
    const session = await getSession();
    // @ts-ignore
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { postId } = await req.json();
    if (!postId) return NextResponse.json({ error: 'Missing postId' }, { status: 400 });

    try {
        const post = await prisma.communityPost.update({
            where: { id: postId },
            data: { likes: { increment: 1 } },
        });
        return NextResponse.json({ likes: post.likes });
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

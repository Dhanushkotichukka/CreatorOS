import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function POST(req: Request) {
    const session = await auth();
    // @ts-ignore
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { postId } = await req.json();
    if (!postId) return NextResponse.json({ error: 'Missing postId' }, { status: 400 });

    const userId = session.user.id;

    try {
        // Check existing like
        const existingLike = await prisma.communityLike.findUnique({
            where: {
                userId_postId: {
                    userId,
                    postId
                }
            }
        });

        if (existingLike) {
            // Unlike
            await prisma.communityLike.delete({
                where: { id: existingLike.id }
            });
        } else {
            // Like
            await prisma.communityLike.create({
                data: {
                    userId,
                    postId
                }
            });
        }

        // Get new count
        const count = await prisma.communityLike.count({
            where: { postId }
        });

        return NextResponse.json({ likes: count, liked: !existingLike });
    } catch (error) {
        console.error("Like Error", error);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

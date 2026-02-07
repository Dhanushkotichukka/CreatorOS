import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
    const session = await getSession();
    if (!session || !(session as any).id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const posts = await prisma.post.findMany({
            where: { userId: (session as any).id },
            orderBy: { scheduledDate: 'asc' }
        });
        return NextResponse.json({ posts });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getSession();
    if (!session || !(session as any).id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { title, date, platform } = await req.json();

        const post = await prisma.post.create({
            data: {
                title,
                scheduledDate: new Date(date),
                platform,
                userId: (session as any).id,
                status: 'scheduled'
            }
        });

        return NextResponse.json({ post });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
    }
}

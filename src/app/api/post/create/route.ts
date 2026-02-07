import { NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function POST(req: Request) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { platforms, postType, content, mediaUrl, scheduledDate } = body;

        // In a real app, save to Prisma DB here
        // await prisma.post.create({ ... })

        console.log("Mock Saving Post:", { platforms, postType, content });

        return NextResponse.json({
            success: true,
            message: "Post scheduled successfully",
            post: {
                id: Math.random().toString(36).substring(7),
                platforms,
                status: 'scheduled',
                scheduledDate: scheduledDate || new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('Post Creation Error:', error);
        return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
    }
}

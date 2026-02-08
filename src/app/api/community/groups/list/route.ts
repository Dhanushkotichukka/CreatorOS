import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const groups = await prisma.communityGroup.findMany({
            where: {
                members: {
                    some: {
                        userId: session.user.id
                    }
                }
            },
            include: {
                _count: {
                    select: { members: true, posts: true }
                },
                members: {
                    where: { userId: session.user.id },
                    select: { role: true }
                }
            },
            orderBy: { updatedAt: 'desc' }
        });

        return NextResponse.json(groups);
    } catch (error) {
        console.error('Error fetching groups:', error);
        return NextResponse.json({ error: 'Failed to fetch groups' }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Find public groups where the user is NOT a member
        const groups = await prisma.communityGroup.findMany({
            where: {
                isPrivate: false,
                members: {
                    none: {
                        userId: session.user.id
                    }
                }
            },
            include: {
                _count: {
                    select: { members: true }
                }
            },
            orderBy: {
                members: {
                    _count: 'desc'
                }
            },
            take: 5
        });

        return NextResponse.json(groups);
    } catch (error) {
        console.error('Error fetching public groups:', error);
        return NextResponse.json({ error: 'Failed to fetch groups' }, { status: 500 });
    }
}

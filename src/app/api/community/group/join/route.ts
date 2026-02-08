import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { groupId } = await req.json();

        if (!groupId) {
            return NextResponse.json({ error: 'Group ID is required' }, { status: 400 });
        }

        // Check if already a member
        const existingMember = await prisma.communityMember.findUnique({
            where: {
                userId_groupId: {
                    userId: session.user.id,
                    groupId
                }
            }
        });

        if (existingMember) {
            return NextResponse.json({ error: 'Already a member' }, { status: 400 });
        }

        const member = await prisma.communityMember.create({
            data: {
                userId: session.user.id,
                groupId,
                role: 'member'
            }
        });

        return NextResponse.json(member);

    } catch (error) {
        console.error('Join Group Error:', error);
        return NextResponse.json({ error: 'Failed to join group' }, { status: 500 });
    }
}

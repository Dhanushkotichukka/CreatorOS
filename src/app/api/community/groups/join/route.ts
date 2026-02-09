import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { groupId } = body;

        if (!groupId) {
            return NextResponse.json({ error: 'Group ID is required' }, { status: 400 });
        }

        // 1. Check if group exists and is public
        const group = await prisma.communityGroup.findUnique({
            where: { id: groupId }
        });

        if (!group) {
            return NextResponse.json({ error: 'Group not found' }, { status: 404 });
        }

        if (group.isPrivate) {
            return NextResponse.json({ error: 'Cannot join private group directly' }, { status: 403 });
        }

        // 2. Check if already a member
        const existingMember = await prisma.groupMember.findUnique({
            where: {
                userId_groupId: {
                    userId: session.user.id,
                    groupId: groupId
                }
            }
        });

        if (existingMember) {
            if (existingMember.status === 'JOINED') {
                return NextResponse.json({ error: 'Already a member' }, { status: 409 });
            }
            // If invited, update to joined
            const updated = await prisma.groupMember.update({
                where: { id: existingMember.id },
                data: { status: 'JOINED', joinedAt: new Date() }
            });
            return NextResponse.json(updated);
        }

        // 3. Join the group
        const newMember = await prisma.groupMember.create({
            data: {
                userId: session.user.id,
                groupId: groupId,
                role: 'MEMBER',
                status: 'JOINED'
            }
        });

        return NextResponse.json(newMember);

    } catch (error) {
        console.error('Error joining group:', error);
        return NextResponse.json({ error: 'Failed to join group' }, { status: 500 });
    }
}

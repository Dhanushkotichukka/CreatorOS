import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { email, groupId } = body;

        if (!email || !groupId) {
            return NextResponse.json({ error: 'Email and Group ID are required' }, { status: 400 });
        }

        // 1. Verify caller is an ADMIN of the group
        const requesterMembership = await prisma.groupMember.findUnique({
            where: {
                userId_groupId: {
                    userId: session.user.id,
                    groupId: groupId
                }
            }
        });

        if (!requesterMembership || requesterMembership.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Only admins can invite members' }, { status: 403 });
        }

        // 2. Find the user to invite
        const userToInvite = await prisma.user.findUnique({
            where: { email }
        });

        if (!userToInvite) {
            return NextResponse.json({ error: 'User not found on CreatorOS' }, { status: 404 });
        }

        // 3. Check if already a member
        const existingMember = await prisma.groupMember.findUnique({
            where: {
                userId_groupId: {
                    userId: userToInvite.id,
                    groupId: groupId
                }
            }
        });

        if (existingMember) {
            if (existingMember.status === 'JOINED') {
                return NextResponse.json({ error: 'User is already a member' }, { status: 409 });
            }
            if (existingMember.status === 'INVITED') {
                return NextResponse.json({ error: 'User already invited' }, { status: 409 });
            }
        }

        // 4. Create Invitation
        const newMember = await prisma.groupMember.create({
            data: {
                userId: userToInvite.id,
                groupId: groupId,
                role: 'MEMBER',
                status: 'INVITED'
            },
            include: {
                user: {
                    select: { name: true, image: true, email: true }
                }
            }
        });

        return NextResponse.json(newMember);

    } catch (error) {
        console.error('Error inviting user:', error);
        return NextResponse.json({ error: 'Failed to invite user' }, { status: 500 });
    }
}

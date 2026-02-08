import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { name, description, isPrivate } = await req.json();

        if (!name) {
            return NextResponse.json({ error: 'Group name is required' }, { status: 400 });
        }

        const group = await prisma.communityGroup.create({
            data: {
                name,
                description,
                isPrivate: isPrivate || false,
                creatorId: session.user.id,
                members: {
                    create: {
                        userId: session.user.id,
                        role: 'admin'
                    }
                }
            }
        });

        return NextResponse.json(group);

    } catch (error) {
        console.error('Create Group Error:', error);
        return NextResponse.json({ error: 'Failed to create group' }, { status: 500 });
    }
}

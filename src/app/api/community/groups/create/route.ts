import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { nanoid } from 'nanoid';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { name, description, isPrivate, imageUrl } = body;

        if (!name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        // Generate a unique invite code
        const code = nanoid(8);

        const group = await prisma.communityGroup.create({
            data: {
                name,
                description,
                isPrivate: isPrivate ?? true,
                imageUrl,
                code,
                createdById: session.user.id,
                members: {
                    create: {
                        userId: session.user.id,
                        role: 'ADMIN',
                        status: 'JOINED'
                    }
                }
            },
            include: {
                _count: {
                    select: { members: true, posts: true }
                }
            }
        });

        return NextResponse.json(group);
    } catch (error) {
        console.error('Error creating group:', error);
        return NextResponse.json({ error: 'Failed to create group' }, { status: 500 });
    }
}

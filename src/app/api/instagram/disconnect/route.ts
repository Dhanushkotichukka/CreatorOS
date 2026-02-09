import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Delete the Instagram account associated with this user
        const deleteResult = await prisma.account.deleteMany({
            where: {
                userId: session.user.id,
                provider: 'instagram'
            }
        });

        if (deleteResult.count === 0) {
            return NextResponse.json({ message: 'No account found to disconnect' }, { status: 200 });
        }

        return NextResponse.json({ success: true, message: 'Disconnected successfully' });
    } catch (error) {
        console.error('Disconnect Error:', error);
        return NextResponse.json({ error: 'Failed to disconnect' }, { status: 500 });
    }
}

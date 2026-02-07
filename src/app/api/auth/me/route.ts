import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET() {
    const session = await auth();

    if (!session || !session.user) {
        return NextResponse.json({ user: null });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email! },
            // Include connections if needed, though they are on the user object
            include: {
                accounts: true
            }
        });

        if (!user) {
            return NextResponse.json({ user: null });
        }

        // Return user without password
        const { password, ...safeUser } = user;
        return NextResponse.json({ user: safeUser });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
    }
}

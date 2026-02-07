import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function PATCH(req: Request) {
    const session = await getSession();
    // @ts-ignore
    if (!session || session.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId, role } = await req.json();
    if (!userId || !role) return NextResponse.json({ error: 'Missing data' }, { status: 400 });

    try {
        const user = await prisma.user.update({
            where: { id: userId },
            data: { role },
        });
        return NextResponse.json({ user });
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

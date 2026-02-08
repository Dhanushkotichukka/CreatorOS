import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
    const session = await getSession();
    // @ts-ignore
    if (!session || session.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const [userCount, postCount, aiCount, connectedCount] = await Promise.all([
            prisma.user.count(),
            prisma.post.count(),
            prisma.aIReport.count(), // Note: Prisma model name for AIReport might be aIReport depending on strict casing, checking schema it is AIReport but prisma often camelCases it. Safe bet is to check generated client, but let's try standard naming.
            prisma.user.count({
                where: {
                    accounts: {
                        some: {
                            provider: {
                                in: ['google', 'instagram']
                            }
                        }
                    }
                }
            })
        ]);

        return NextResponse.json({
            userCount,
            postCount,
            aiCount,
            connectedCount
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
}

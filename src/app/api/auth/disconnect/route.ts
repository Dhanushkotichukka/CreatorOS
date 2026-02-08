import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function DELETE(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { provider } = body;

        if (!provider) {
            return NextResponse.json({ error: 'Provider is required' }, { status: 400 });
        }

        // Delete the account connection
        // We use deleteMany to ensure we only delete accounts belonging to THIS user
        // and to handle cases where multiple might exist (though unlikely)
        const result = await prisma.account.deleteMany({
            where: {
                userId: session.user.id,
                provider: provider
            }
        });

        if (result.count === 0) {
            return NextResponse.json({ message: 'No account found to disconnect' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: `Disconnected ${provider} successfully` });
    } catch (error) {
        console.error('Disconnect Error:', error);
        return NextResponse.json({ error: 'Failed to disconnect account' }, { status: 500 });
    }
}

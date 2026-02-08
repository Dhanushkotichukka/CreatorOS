import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    const session = await auth();
    if (!session || !session.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Fetch deep stats
    const stats = await prisma.channelStats.findFirst({
        where: { userId: session.user.id!, platform: 'youtube' },
        orderBy: { date: 'desc' }
    });

    if (!stats || !stats.rawData) {
        return NextResponse.json({ advice: "Please connect and sync your YouTube channel first to get personalized coaching." });
    }

    const { channelSnippet, recentVideos } = JSON.parse(stats.rawData);

    // Construct context for AI
    const context = `
    Analyze this YouTube channel: "${channelSnippet.title}".
    Subscribers: ${stats.followers}. Total Views: ${stats.views}.
    Recent Videos:
    ${recentVideos.map((v: any) => `- ${v.title} (${v.views} views, ${v.likes} likes)`).join('\n')}
    
    Provide 3 specific, actionable growth tips based on their recent performance. 
    Focus on what topics are working vs not. Keep it concise, professional, and encouraging.
    `;

    try {
        if (!genAI) throw new Error("No Gemini Key");
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(context);
        const advice = result.response.text();

        return NextResponse.json({ advice });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ advice: "Focus on consistency and high-quality thumbnails to improve CTR." });
    }
}

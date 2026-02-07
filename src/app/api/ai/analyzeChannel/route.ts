import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
    try {
        const { stats } = await req.json();
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `
        Analyze this YouTube channel performance and give 3 actionable growth suggestions.
        Be concise and professional.
        
        Channel Stats:
        - Subscribers: ${stats.channel.subscriberCount}
        - Total Views: ${stats.channel.viewCount}
        - Video Count: ${stats.channel.videoCount}
        
        Recent Videos Performance (Last 5):
        ${stats.videos.slice(0, 5).map((v: any) => `- ${v.title}: ${v.views} views`).join('\n')}
        
        Focus on engagement trends and viral potential.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ analysis: text });
    } catch (error) {
        console.error('AI Analysis Error:', error);
        return NextResponse.json({ error: 'Failed to generate analysis' }, { status: 500 });
    }
}

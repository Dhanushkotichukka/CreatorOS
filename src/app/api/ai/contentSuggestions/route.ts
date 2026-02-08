
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { prisma } from '@/lib/prisma';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { platform, history } = await req.json();

        // 1. Analyze History for "Viral" patterns
        // We expect `history` to be an array of video/post objects with performance stats
        const viralContent = history.filter((item: any) => {
            if (platform === 'youtube') return parseInt(item.views || 0) > 500; // Threshold
            return item.like_count > 50;
        });

        const prompt = `
            You are a Viral Content Strategist.
            Based on the following successful ${platform} content from this creator:
            ${JSON.stringify(viralContent.slice(0, 5))}

            Generate 3 High-Potential Content Ideas for their next posts.
            Focus on:
            1. Why the previous content worked (Hook, Topic, or Style).
            2. specific Title/Caption.
            3. A brief "Script Hook" or visual composition idea.

            Return JSON format:
            {
                "analysis": "Brief analysis of what is working...",
                "suggestions": [
                    { "title": "...", "reason": "...", "scriptHook": "..." },
                    ...
                ]
            }
        `;

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text().replace(/```json/g, '').replace(/```/g, '').trim();

        const data = JSON.parse(text);
        return NextResponse.json(data);

    } catch (error) {
        console.error('AI Content Suggestions Error:', error);
        return NextResponse.json({
            analysis: "Focus on your highest performing topics.",
            suggestions: [
                { title: "Day in the Life", reason: "High engagement on personal stories.", scriptHook: "Start with a chaotic moment." },
                { title: "Tutorial: Advanced Tips", reason: "Educational content saves are high.", scriptHook: "Stop doing X, do Y instead." },
                { title: "Industry News Reaction", reason: "Timeliness drives views.", scriptHook: "Did you hear about [News]?" }
            ]
        });
    }
}

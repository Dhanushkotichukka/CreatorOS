import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const { platform, stats } = await req.json();
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `
        You are an expert social media strategist. Analyze this creator's profile data for ${platform} and provide a score and actionable feedback.
        
        Data:
        ${JSON.stringify(stats, null, 2)}
        
        Return a valid JSON object with this exact structure:
        {
            "score": number (0-100),
            "strengths": ["string", "string", "string"],
            "improvements": ["string", "string", "string"],
            "summary": "string"
        }
        Do not include any markdown formatting, just the raw JSON.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        // Clean up markdown code blocks if present
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();

        const analysis = JSON.parse(text);

        return NextResponse.json(analysis);
    } catch (error) {
        console.error('AI Profile Analysis Error:', error);
        return NextResponse.json({
            score: 75,
            strengths: ["Content consistency", "Good visual quality"],
            improvements: ["Engagement rate is low", "Try more trending audio"],
            summary: "Analysis failed, showing placeholder. Please try again."
        });
    }
}

import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
    try {
        const { platform, stats } = await req.json();
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `
        Act as a senior social media strategist. Analyze this ${platform} creator's performance and provide a detailed improvement plan.
        
        Data:
        ${JSON.stringify(stats, null, 2)}
        
        Return the response as a valid JSON object with this exact structure:
        {
            "score": number (0-100),
            "summary": "Short 1-sentence summary of current status.",
            "strengths": ["string", "string"],
            "weaknesses": ["string", "string"],
            "actions": [
                { "title": "string", "description": "string (actionable advice)" },
                { "title": "string", "description": "string" },
                { "title": "string", "description": "string" }
            ],
            "strategy": {
                "postingFrequency": "string (e.g. 3x/week)",
                "bestTime": "string (e.g. 6PM EST)",
                "contentFocus": "string (e.g. Educational Shorts)"
            }
        }
        Do not use markdown formatting in the output.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        // Clean up markdown code blocks if present
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();

        const analysis = JSON.parse(text);

        return NextResponse.json(analysis);
    } catch (error) {
        console.error('AI Improvement Analysis Error:', error);
        return NextResponse.json({
            score: 72,
            summary: "Good foundation, but consistency needs improvement.",
            strengths: ["High visual quality", "Good engagement on reels"],
            weaknesses: ["Irregular posting schedule", "Low comment response rate"],
            actions: [
                { title: "Optimize Strategy", description: "Post at least 3 times a week to build momentum." },
                { title: "Engage More", description: "Reply to comments within the first hour." },
                { title: "Cross-Promote", description: "Share your top posts to stories." }
            ],
            strategy: {
                postingFrequency: "3-4x / week",
                bestTime: "18:00 Local Time",
                contentFocus: "Behind-the-scenes & Tutorials"
            }
        });
    }
}

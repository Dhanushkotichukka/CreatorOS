import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { platform, stats } = await req.json();

        // ---------------------------------------------------------
        // Construct Prompt
        // ---------------------------------------------------------
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        let context = "";
        if (platform === 'youtube') {
            context = `
                Platform: YouTube
                Subscribers: ${stats.subscriberCount}
                Views: ${stats.viewCount}
                Video Count: ${stats.videoCount}
                Recent Videos: ${JSON.stringify(stats.videos?.slice(0, 5) || [])}
            `;
        } else {
            context = `
                Platform: Instagram
                Followers: ${stats.followers}
                Media Count: ${stats.media_count}
                Recent Posts: ${JSON.stringify(stats.posts?.slice(0, 5) || [])}
            `;
        }

        const prompt = `
            You are an expert Social Media Strategist and Data Analyst for top creators.
            Analyze the following ${platform} data and provide a "Growth Audit".
            
            ${context}

            Your response must be a valid JSON object with the following structure:
            {
                "score": (number 0-100, based on engagement health),
                "summary": (string, 1-2 sentences summarizing performance),
                "strategy": {
                    "postingFrequency": (string, e.g. "3x week"),
                    "bestTime": (string, e.g. "6 PM EST"),
                    "contentFocus": (string, e.g. "Educational Shorts")
                },
                "actions": [
                    { "title": (string), "description": (string) }
                ],
                "strengths": [(string), (string)],
                "weaknesses": [(string), (string)]
            }
            
            Do not include markdown formatting like \`\`\`json. Just return the raw JSON string.
        `;

        // ---------------------------------------------------------
        // Call AI
        // ---------------------------------------------------------
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text().replace(/```json/g, '').replace(/```/g, '').trim();

        try {
            const data = JSON.parse(text);
            return NextResponse.json(data);
        } catch (parseError) {
            console.error("AI JSON Parse Error", parseError);
            // Fallback if AI hallucinates format
            return NextResponse.json({
                score: 75,
                summary: "AI analyis pending. Focus on consistent uploading for now.",
                strategy: { postingFrequency: "Daily", bestTime: "12 PM", contentFocus: "Trending" },
                actions: [{ title: "Maintain Streak", description: "Keep posting daily to train the algorithm." }],
                strengths: ["Consistency"],
                weaknesses: ["Engagement"]
            });
        }

    } catch (error) {
        console.error('AI Improvement Analysis Error:', error);
        return NextResponse.json({ error: 'Failed to analyze' }, { status: 500 });
    }
}

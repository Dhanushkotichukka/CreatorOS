import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from 'next/server';

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    let topic = '', language = '';

    try {
        const body = await req.json();
        topic = body.topic;
        language = body.language;

        if (!genAI) {
            return NextResponse.json({
                result: `(Mock) Please add GEMINI_API_KEY to .env.local to generate real stories for: ${topic}`,
                language
            });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const lang = language === 'telugu' ? 'Telugu' : 'English';

        // Specific prompt for long-form storytelling
        const prompt = `Write a highly detailed, immersive, and long-form story about "${topic}" in ${lang}. 
        REQUIREMENTS:
        1. Length: Minimum 100 lines / 1000 words.
        2. Depth: Include deep character development, dialogue, and vivid scene descriptions.
        3. Structure: Well-defined Beginning, Middle (Conflict), and End.
        4. Tone: Professional, engaging, and suitable for a high-quality video script or book.
        5. Content: If the topic is specific (e.g., 'Bahubali'), ensure factual/lore accuracy while being creative.
        `;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        return NextResponse.json({ result: text, language });
    } catch (error) {
        console.error('AI Story Error:', error);

        // Robust Fallback
        const lang = language === 'telugu' ? 'Telugu' : 'English';
        const fallbackStory = language === 'telugu'
            ? `అనగనగా... "${topic}" గురించి ఒక అద్భుతమైన కథ... (గమనిక: మీ API Key ఇంకా యాక్టివేట్ కాలేదు, ఇది డెమో స్టోరీ).`
            : `Once upon a time, there was a fascinating tale about ${topic}... (Note: API Key issue detected, showing demo story).`;

        return NextResponse.json({ result: fallbackStory, language });
    }
}

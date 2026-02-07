import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("❌ No GEMINI_API_KEY found");
        return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    try {
        // Note: There isn't a direct listModels on the high-level client in some versions, 
        // but let's try just hitting gemini-pro again or 1.0-pro 
        // Actually, let's try "gemini-1.0-pro" which is stable.

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
        const result = await model.generateContent("test");
        console.log("Success with gemini-1.5-flash-latest");
    } catch (error) {
        console.log("Failed with flash-latest:", error.message.split(' ')[0]);
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent("test");
        console.log("Success with gemini-pro");
    } catch (error) {
        console.log("Failed with gemini-pro:", error.message.split(' ')[0]);
    }
}

// Just try one that usually works for free tier
async function testStable() {
    const apiKey = process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    // Wait, the error said "models/gemini-1.5-flash is not found".
    // It might need "models/" prefix? No.
    // Let's try "gemini-pro" again but maybe the key is new and needs time?
}
// Actually, let's just stick to "gemini-pro" as it's the safest legacy alias, 
// but the first error said "models/gemini-pro is not found".
// This implies the API key might not have access to these models or the API version is v1beta and it wants specific model names.
// A common issue is the region or the specific free tier constraints.
// Let's try `gemini-1.0-pro`
console.log("Testing gemini-pro...");

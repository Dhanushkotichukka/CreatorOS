import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function diagnose() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("❌ No API Key found");
        return;
    }

    console.log("🔑 Testing Key:", apiKey.substring(0, 10) + "...");
    const genAI = new GoogleGenerativeAI(apiKey);

    const modelsToTest = [
        "gemini-1.5-flash",
        "gemini-pro",
        "gemini-1.5-pro",
        "gemini-1.0-pro"
    ];

    console.log("\n🧪 Testing Models...");

    let success = false;

    for (const modelName of modelsToTest) {
        try {
            process.stdout.write(`   - ${modelName}: `);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hi");
            const response = await result.response;
            console.log(`✅ WORKING`);
            success = true;
            break; // Found one!
        } catch (error) {
            let msg = error.message;
            if (msg.includes("404")) msg = "404 Not Found (Not enabled or wrong region)";
            console.log(`❌ FAILED (${msg})`);
        }
    }

    if (!success) {
        console.log("\n⚠️ ALL MODELS FAILED. Possible reasons:");
        console.log("1. 'Generative Language API' is NOT ENABLED in Google Cloud Console.");
        console.log("2. The API Key is restricted (IP restriction or Referrer restriction).");
        console.log("3. Billing is disabled for the project (though free tier should work).");
    }
}

diagnose();

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function resolveHandle() {
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
        console.error("❌ No YOUTUBE_API_KEY found");
        return;
    }

    // The user gave: https://www.youtube.com/@MrDhanuCreations
    // We extract the handle: @MrDhanuCreations
    const handle = "@MrDhanuCreations";

    console.log(`🔍 Resolving handle: ${handle}...`);

    const url = `https://www.googleapis.com/youtube/v3/channels?part=id,statistics&forHandle=${encodeURIComponent(handle)}&key=${apiKey}`;

    try {
        const res = await fetch(url);
        const data = await res.json();

        if (data.items && data.items.length > 0) {
            console.log("✅ FOUND!");
            console.log(`Channel ID: ${data.items[0].id}`);
            console.log(data.items[0].statistics);
        } else {
            console.log("❌ Not Found (or API doesn't support forHandle on this key/quota)");
            console.log(JSON.stringify(data, null, 2));
        }
    } catch (error) {
        console.log(`❌ NETWORK ERROR: ${error.message}`);
    }
}

resolveHandle();

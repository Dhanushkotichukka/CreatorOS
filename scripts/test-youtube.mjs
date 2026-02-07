import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function testYouTube() {
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
        console.error("❌ No YOUTUBE_API_KEY found");
        return;
    }

    console.log("🔑 Testing YouTube Key:", apiKey.substring(0, 10) + "...");

    // Try to search for a generic term "Google" to test quota/access
    // We need a valid endpoint. search.list is expensive on quota but standard.
    // channels.list is cheaper usually if we have an ID, but we don't.
    // Let's try to get a random channel or just use a known ID (e.g. Google Developers: UC_x5XG1OV2P6uZZ5FSM9Ttw)

    const channelId = "UC_x5XG1OV2P6uZZ5FSM9Ttw";
    const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${apiKey}`;

    try {
        const res = await fetch(url);
        const data = await res.json();

        if (data.error) {
            console.log(`❌ FAILED: ${data.error.message}`);
        } else if (data.items) {
            console.log("✅ WORKING! Found channel stats.");
            console.log(data.items[0].statistics);
        } else {
            console.log("⚠️ Response OK but no items (Strange but likely Key is OK)");
            console.log(data);
        }
    } catch (error) {
        console.log(`❌ NETWORK ERROR: ${error.message}`);
    }
}

testYouTube();


export interface CreatorIntelligence {
    healthScore: number;
    streak: number;
    growthTrend: string;
    aiCoachMessage: string;
    youtube?: {
        connected: boolean;
        subscribers: number;
        views: number;
        recentVideos: any[];
        growth: string;
        avgViews: number;
    };
    instagram?: {
        connected: boolean;
        followers: number;
        mediaCount: number;
        recentMedia: any[];
        growth: string;
        avgLikes: number;
    };
    actionItems: Array<{ title: string; type: 'urgent' | 'growth' | 'idea' }>;
    nextViralIdea: string;
}

export async function fetchCreatorIntelligence(): Promise<CreatorIntelligence | null> {
    try {
        // 1. Fetch Core Overview (Streak, Health, Basic Stats)
        const overviewRes = await fetch('/api/dashboard/overview');
        if (!overviewRes.ok) throw new Error('Failed to fetch overview');
        const overview = await overviewRes.json();

        // 2. Fetch Deep AI Analysis (Parallel)
        // We need basic stats to prompt the AI, so we use the overview data
        const statsForAI = {
            ...overview,
            youtube: overview.youtube,
            instagram: overview.instagram
        };

        // Note: We are using the existing AI endpoints but orchestrating them here
        // We might trigger a background refresh if data is stale, but for now we fetch directly.
        // To avoid long loading, we can return the overview first and stream AI later, 
        // but for this utility, we'll wait or return partial.

        const intelligence: CreatorIntelligence = {
            healthScore: overview.healthScore || 50,
            streak: overview.streak || 0,
            growthTrend: calculateGrowthTrend(overview),
            aiCoachMessage: overview.suggestion || "Consistency is key. Keep posting!",
            youtube: overview.youtube,
            instagram: overview.instagram,
            actionItems: generateActionItems(overview),
            nextViralIdea: "Loading..." // We might fetch this lazily
        };

        return intelligence;

    } catch (error) {
        console.error("CreatorBrain Disconnected:", error);
        return null;
    }
}

function calculateGrowthTrend(data: any): string {
    // Simple heuristic based on available growth metrics
    const ytGrowth = parseFloat(data.youtube?.growth || "0");
    const igGrowth = parseFloat(data.instagram?.growth || "0");
    const avg = (ytGrowth + igGrowth);

    if (avg > 5) return "Explosive 🚀";
    if (avg > 0) return "Steady 📈";
    return "Stagnant 😐";
}

function generateActionItems(data: any): any[] {
    const items = [];

    // Urgent: Streak
    if (data.streak === 0) {
        items.push({ title: "Post today to start a new streak!", type: "urgent" });
    } else if (data.streak % 7 === 0) {
        items.push({ title: "7-day streak milestone! Share a story.", type: "growth" });
    }

    // Growth: Platform specific
    if (data.youtube?.connected && data.youtube.growth.startsWith('-')) {
        items.push({ title: "YouTube views are down. Try a Short.", type: "growth" });
    }

    if (!data.instagram?.connected) {
        items.push({ title: "Connect Instagram to boost Health Score.", type: "idea" });
    }

    return items;
}

// Helper to fetch AI idea specifically (lazy load)
export async function fetchNextViralIdea(platform: 'youtube' | 'instagram', history: any[]) {
    try {
        const res = await fetch('/api/ai/contentSuggestions', {
            method: 'POST',
            body: JSON.stringify({ platform, history })
        });
        const data = await res.json();
        return data.suggestions?.[0]?.title || "Behind the Scenes Vlog";
    } catch (e) {
        return "Day in the Life";
    }
}

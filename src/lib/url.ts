export const getBaseUrl = () => {
    if (process.env.NODE_ENV === "production") {
        return "https://creatoros.app";
    }
    // Allow override via NEXTAUTH_URL (e.g. ngrok), otherwise localhost
    return process.env.NEXTAUTH_URL || "http://localhost:3000";
};

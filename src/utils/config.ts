import { config } from "dotenv";

if (process.env.NODE_ENV !== 'production') {
    config();
}

const environmentVariables = {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV,
    sessionSecret: process.env.SESSION_SECRET || "temperory_development_secret",
    databaseUrl: process.env.DATABASE_URL,
    openAIApiKey: process.env.OPENAI_API_KEY,
    googleOauthClientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
    googleOauthClientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    googleOauthRedirectUri: process.env.GOOGLE_OAUTH_REDIRECT_URI,
};

export default environmentVariables;
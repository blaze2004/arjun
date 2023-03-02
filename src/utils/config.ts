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
    deploymentUrl: process.env.DEPLOYMENT_URL,
};

export default environmentVariables;
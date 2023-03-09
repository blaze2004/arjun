import { config } from 'dotenv';

if (process.env.NODE_ENV!=='production') {
    config();
}

const environmentVariables={
    port: process.env.PORT||3000,
    nodeEnv: process.env.NODE_ENV,
    sessionSecret: process.env.SESSION_SECRET||'temperory_development_secret',
    databaseUrl: process.env.DATABASE_URL,
    openAIApiKey: process.env.OPENAI_API_KEY,
    googleOauthClientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
    googleOauthClientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    googleOauthRedirectUri: process.env.SUPABASE_URL+'/auth/v1/callback',
    supabaseUrl: process.env.SUPABASE_URL as string,
    supabaseKey: process.env.SUPABASE_ANON_KEY as string,
}

export default environmentVariables;

import { Response, NextFunction, Request } from "express";
import supabase from "./supabaseClient";

const checkApiKey=async (req: Request, res: Response, next: NextFunction) => {

    if (req&&req.body) {
        if (
            req.body.owner&&
            req.body.messageObj&&
            req.headers['x-api-key']
        ) {
            const apiKey=req.headers['x-api-key'];
            const owner=req.body.owner;

            try {

                const { data, error, status }=await supabase
                    .from("api_keys")
                    .select(`id, key, owner`)
                    .eq("owner", owner)
                    .eq("key", apiKey)
                    .single();

                if ((error&&status!==406)||data===null) {
                    return res.status(401).json({ message: 'Invalid API key' });
                }
                // API key is valid
                next();

            } catch (error) {
                console.error(error);
                return res.status(500).json({ message: 'Internal server error' });
            }
        }
    }
}

export default checkApiKey;
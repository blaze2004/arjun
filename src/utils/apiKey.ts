import { Response, NextFunction, Request } from "express";
import { pgPool } from "./sessionManager";

const checkApiKey = async (req: Request, res: Response, next: NextFunction) => {

    if (req && req.body) {
        if (
            req.body.owner &&
            req.body.messageObj &&
            req.headers['x-api-key']
        ) {
            const apiKey = req.headers['x-api-key'];
            const owner = req.body.owner;

            try {
                const query = {
                    text: "SELECT * FROM api_keys WHERE key =$1 AND owner = $2",
                    values: [apiKey, owner]
                };

                const result = await pgPool.query(query);

                if (result.rows.length === 0) {
                    // API key not found in database
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
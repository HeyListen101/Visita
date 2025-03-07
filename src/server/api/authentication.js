import { Router } from 'express';
import { createClient } from "@supabase/supabase-js";

const createAuthRouter = (supabaseUrl, supabaseAnonKey, baseUrl) => {
    const router = Router();
    const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

    // Google OAuth Route
    router.get("/google", async (req, res) => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: "google",
                options: {
                    redirectTo: `${process.env.VITE_BASE_URL}/auth/callback`,
            },
        });

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        res.redirect(data.url);
    });

    // Google OAuth Callback Route
    router.get("/callback", (req, res) => {
        // #TODO: retrieve user info from Supabase
        res.redirect(`${process.env.VITE_BASE_URL}/map`);
    });

    // Custom Email & Password Sign-In
    router.post('/supabase-login', async (req, res) => {
        const {email, password} = req.body;

        const {data, error} = await supabase.auth.signInWithPassword({email, password});
        if (error) {
            return res.status(400).json({error: error.message});
        }

        res.json({user: data.user});
    });
    
    return router;
};

export default createAuthRouter;
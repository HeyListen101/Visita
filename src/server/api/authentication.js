import { Router } from 'express';
import { createClient } from "@supabase/supabase-js";

const createAuthRouter = (supabaseUrl, supabaseAnonKey, baseUrl) => {
    const router = Router();
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    { /* Google OAuth Callback Route */ }
    router.get("/google", async (req, res) => {
        const redirectUrl = `${baseUrl}/auth/callback`;
        console.log("🔹 Redirecting to Google OAuth:", redirectUrl); // Debugging Log
    
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: redirectUrl,
                queryParams: {
                    access_type: "offline",  // Keep this to get a refresh token
                    prompt: "consent",       // Forces Google to ask for consent
                    response_type: "code",   // ✅ Forces an authorization code instead of token
                    scopes: 'https://www.googleapis.com/auth/userinfo.email'
                },
            },
        });
    
        if (error) {
            console.error("❌ Google OAuth error:", error.message);
            return res.status(400).json({ error: error.message });
        }
    
        console.log("✅ Redirect URL from Supabase:", data.url); // Debugging Log
        res.redirect(data.url);
    });
    

    { /* Google OAuth Callback Route */ }
    router.get("/callback", async function (req, res) {
        console.log("🔹 Full Request Query Params:", req.query); // Debugging Log
    
        const code = req.query.code;
        const next = req.query.next ?? "/map";
    
        if (!code) {
            console.error("❌ No authorization code received!");
            return res.status(400).send("Missing authorization code");
        }
    
        console.log("✅ Received Authorization Code:", code);
    
        const supabase = createServerClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_ANON_KEY, {
            cookies: {
                getAll() {
                    return parseCookieHeader(req.headers.cookie ?? '');
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        res.appendHeader('Set-Cookie', serializeCookieHeader(name, value, options))
                    );
                },
            },
        });
    
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);
        
        if (error) {
            console.error("❌ Error exchanging code for session:", error.message);
            return res.status(400).send("OAuth exchange failed");
        }
    
        console.log("✅ Session exchanged successfully:", data);
    
        // Save the user to the database
        if (data?.user) {
            const user = data.user;
            const { error: insertError } = await supabase
                .from("Contributor")
                .upsert({
                    ContributorID: user.id,
                    Name: user.user_metadata.full_name ?? null,
                    EmailAddress: user.email,
                    DateCreated: new Date(),
                    IsArchived: false
                });
    
            if (insertError) {
                console.error("❌ Error inserting/updating user:", insertError.message);
            } else {
                console.log("✅ User saved successfully in Contributor table");
            }
        }
    
        res.redirect(303, `/${next.slice(1)}`);
    });
    

    { /* Custom Email & Password Sign-In */ }
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
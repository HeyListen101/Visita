import { supabase } from "./supabaseClient.js";x

const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
  });

  if (error) {
    console.error("Google Sign-In Error:", error.message);
  } else {
    console.log("User signed in:", data);
  }
};

export default signInWithGoogle;

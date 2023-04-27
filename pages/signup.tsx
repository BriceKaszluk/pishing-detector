import { useSessionContext, useSupabaseClient } from "@supabase/auth-helpers-react";
import type { NextPage } from "next";
import { Button } from "@mui/material";

const SignUpPage: NextPage = () => {
  const { isLoading, session } = useSessionContext();
  const supabaseClient = useSupabaseClient();

  const handleSignInWithGoogle = async () => {
    const { error } = await supabaseClient.auth.signInWithOAuth({ provider: "google",   options: {
      redirectTo: `${process.env.NEXT_PUBLIC_HOSTNAME}/dashboard?isConnected=1`
    } });

    if (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  if (!session) {
    return (
      <>
        {isLoading ? <h1>Loading...</h1> : ""}
        <div className="md:w-4/12 m-auto px-4 min-h-main flex flex-col justify-center">
          <Button
            variant="contained"
            color="primary"
            onClick={handleSignInWithGoogle}
            className="bg-button"
          >
            Se connecter avec Google
          </Button>
        </div>
      </>
    );
  } else {
    return null;
  }
};

export default SignUpPage;

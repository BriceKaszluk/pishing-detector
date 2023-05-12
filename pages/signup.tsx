import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useSessionContext, useSupabaseClient } from "@supabase/auth-helpers-react";
import type { NextPage } from "next";
import { Button, Typography, Box, Container, Card, CardContent } from "@mui/material";

const SignUpPage: NextPage = () => {
  const { isLoading, session } = useSessionContext();
  const supabaseClient = useSupabaseClient();
  const router = useRouter();

  const handleSignInWithGoogle = async () => {
    const { error } = await supabaseClient.auth.signInWithOAuth({ provider: "google", options: {
      redirectTo: `${process.env.NEXT_PUBLIC_HOSTNAME}/dashboard?isConnected=true`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    } });

    if (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  useEffect(() => {
    if (router.query.refresh === "true") {
      handleSignInWithGoogle();
    }
  }, [router.query.refresh]);

  if (!session) {
    return (
      <Container maxWidth="sm">
        {isLoading ? <h1>Loading...</h1> : ""}
        <Box 
          display="flex" 
          flexDirection="column" 
          justifyContent="center" 
          alignItems="center" 
          padding={4}
        >
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h4" gutterBottom style={{ marginBottom: "32px" }}>
              Bienvenue dans l&aposAnalyseur de Mail
              </Typography>
              <Typography variant="body1" style={{ marginBottom: "32px" }}>
              Pour utiliser notre service d&aposanalyse d&apose-mails, vous devez vous connecter avec un compte Gmail. Actuellement, nous sommes uniquement en mesure d&aposanalyser les e-mails provenant de Gmail.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleSignInWithGoogle}
                className="bg-button"
                size="large"
              >
                Se connecter avec Google
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Container>
    );
  } else {
    return null;
  }
};

export default SignUpPage;

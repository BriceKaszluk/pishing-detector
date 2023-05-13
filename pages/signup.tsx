import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import {
  useSessionContext,
  useSupabaseClient,
} from '@supabase/auth-helpers-react';
import type { NextPage } from 'next';
import {
  Button,
  Typography,
  Box,
  Container,
  Card,
  CardContent,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import Link from 'next/link';

const SignUpPage: NextPage = () => {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const { isLoading, session } = useSessionContext();
  const supabaseClient = useSupabaseClient();
  const router = useRouter();

  const handleSignInWithGoogle = async () => {
    const { error } = await supabaseClient.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_HOSTNAME}/dashboard?isConnected=true`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  const handleTermsChange = (event) => {
    setAcceptedTerms(event.target.checked);
  };

  useEffect(() => {
    if (router.query.refresh === 'true') {
      handleSignInWithGoogle();
    }
  }, [router.query.refresh]);

  if (!session) {
    return (
      <Container maxWidth="sm">
        {isLoading ? <h1>Loading...</h1> : ''}
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          padding={4}
        >
          <Card variant="outlined">
            <CardContent>
              <Typography
                variant="h4"
                gutterBottom
                style={{ marginBottom: '32px' }}
              >
                Bienvenue dans l&apos;Analyseur de Mail
              </Typography>
              <Typography variant="body1" style={{ marginBottom: '32px' }}>
                Pour utiliser notre service d&apos;analyse d&apos;e-mails, vous
                devez vous connecter avec un compte Gmail. Actuellement, nous
                sommes uniquement en mesure d&apos;analyser les e-mails
                provenant de Gmail.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleSignInWithGoogle}
                disabled={!acceptedTerms}
                className="bg-button"
                size="large"
              >
                Se connecter avec Google
              </Button>
              <FormControlLabel
                sx={{ marginTop: 2 }}
                control={
                  <Checkbox
                    checked={acceptedTerms}
                    onChange={handleTermsChange}
                    name="acceptedTerms"
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body2">
                    J&apos;accepte les{' '}
                    <Typography
                      variant="body2"
                      component={Link}
                      href="/termsOfUse"
                      sx={{ color: 'blue' }}
                    >
                      conditions d&apos;utilisation
                    </Typography>{' '}
                    et la{' '}
                    <Typography
                      variant="body2"
                      component={Link}
                      href="/privacyPolicy"
                      sx={{ color: 'blue' }}
                    >
                      politique de confidentialité
                    </Typography>
                  </Typography>
                }
              />
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

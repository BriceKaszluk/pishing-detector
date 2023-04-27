import React from "react";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSidePropsContext } from "next";
import { useSupabaseClient, useSessionContext } from "@supabase/auth-helpers-react";
import axios from "axios";
import { Box, Button, Typography } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { useRouter } from "next/router";

export default function Dashboard({
  hasAcceptedScope,
}: {
  hasAcceptedScope: boolean;
}) {
  const supabaseClient = useSupabaseClient();
  const { session } = useSessionContext();
  const router = useRouter();

  const getEmailsFromLastWeekAndUpdateState = async () => {
    if (session) {
      try {
        const response = await fetch('/api/getMailsList');
        if (response.ok) {
          const data = await response.json();
          console.log('Emails from last week:', data.emails);
          // Mettez à jour l'état du composant avec les e-mails récupérés
        } else {
          console.error('Failed to fetch emails:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching emails:', error);
      }
    }
  };

  if(hasAcceptedScope || router.query.hasAcceptedScope) {
    getEmailsFromLastWeekAndUpdateState();
  }

  async function requestAdditionalScope() {
    if (!hasAcceptedScope) {
      try {
        const { error: additionalScopeError } =
          await supabaseClient.auth.signInWithOAuth({
            provider: "google",
            options: {
              scopes: "https://www.googleapis.com/auth/gmail.readonly",
              redirectTo: `${process.env.NEXT_PUBLIC_HOSTNAME}/phishing-detector?isConnected=1&hasAcceptedScope=1`,
            },
          });

        if (additionalScopeError) {
          throw additionalScopeError;
        } else {
          console.log("Additional scope requested successfully");
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error requesting additional scope:", error.message);
        } else {
          console.error("Error requesting additional scope:", error);
        }
      }
    }
  }

  return (
    <Box>
      {hasAcceptedScope || router.query.hasAcceptedScope ? (
        <Typography variant="body1" color="success">
          <CheckCircle sx={{ mr: 1, fontSize: 'inherit' }} />
          Accès autorisé à Gmail
        </Typography>
      ) : (
        <Button
          variant="contained"
          color="primary"
          onClick={requestAdditionalScope}
          className="bg-button"
        >
          Autoriser l'accès à ma boite Gmail
        </Button>
      )}
    </Box>
  );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { query } = ctx;
  const isConnected = query.isConnected;
  // Create authenticated Supabase Client
  const supabase = createServerSupabaseClient(ctx);
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session && !isConnected)
    return {
      redirect: {
        destination: "/signup",
        permanent: false,
      },
    };

  let hasAcceptedScope = false;

  try {
    if (session) {
      const response = await axios.get(
        `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${session.provider_token}`
      );

      const acceptedScopes = response.data.scope.split(" ");
      const requiredScope = "https://www.googleapis.com/auth/gmail.readonly";

      if (acceptedScopes.includes(requiredScope)) {
        hasAcceptedScope = true;
      } else {
        hasAcceptedScope = false;
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error:", error.message);
    } else {
      console.error("Error:", error);
    }
  }

  return {
    props: {
      hasAcceptedScope,
    },
  };
};

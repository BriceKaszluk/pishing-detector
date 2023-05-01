import React, { useState, useEffect, useCallback } from "react";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSidePropsContext } from "next";
import { checkProviderToken, checkSession } from "../services/checkAuth";
import {
  useSupabaseClient,
  useSessionContext,
} from "@supabase/auth-helpers-react";
import { Box, Button, Typography } from "@mui/material";
import { CheckCircle } from "@mui/icons-material";
import { useRouter } from "next/router";
import { MailList, Mail } from "../components/MailList";

type UserMail = Mail & {
  id: string;
  threadId: string;
  snippet: string;
  internalDate: string;
  labelIds: string[];
};

export default function PhishingDetector({
  hasAcceptedScope,
}: {
  hasAcceptedScope: boolean;
}) {
  const supabaseClient = useSupabaseClient();
  const { session } = useSessionContext();
  const router = useRouter();
  const [userMails, setUserMails] = useState<UserMail[]>([]);
  const [emailsLoaded, setEmailsLoaded] = useState(false);

  const getEmailsFromLastWeekAndUpdateState = useCallback(async () => {
    console.log("getEmailsFromLastWeekAndUpdateState est appelé")
    console.log(session, "session")
    if (session) {
      try {
        const response = await fetch("/api/getMailsList");
        if (response.ok) {
          const data = await response.json();
  
          setUserMails(data.emails);
          setEmailsLoaded(true);
        } else {
          console.error("Failed to fetch emails:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching emails:", error);
      }
    }
  }, [session]);

  useEffect(() => {
    if ((hasAcceptedScope || router.query.hasAcceptedScope) && !emailsLoaded) {
      console.log("on lance la récupération des mails")
      getEmailsFromLastWeekAndUpdateState();
    }
  }, [hasAcceptedScope, router.query.hasAcceptedScope, emailsLoaded, session]);

  async function requestAdditionalScope() {
    if (!hasAcceptedScope) {
      try {
        const { error: additionalScopeError } =
          await supabaseClient.auth.signInWithOAuth({
            provider: "google",
            options: {
              scopes: "https://www.googleapis.com/auth/gmail.readonly",
              redirectTo: `${process.env.NEXT_PUBLIC_HOSTNAME}/phishing-detector?isConnected=1&hasAcceptedScope=1`,
              queryParams: {
                access_type: 'offline',
              },
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
        <Box>
          <Typography variant="body1" color="success">
            <CheckCircle sx={{ mr: 1, fontSize: "inherit" }} />
            Accès autorisé à Gmail
          </Typography>
          {userMails.length >= 1 ? <MailList userMails={userMails} /> : null}
        </Box>
      ) : (
        <Button
          variant="contained"
          color="primary"
          onClick={requestAdditionalScope}
          className="bg-button"
        >
          Autoriser l&apos;accès à ma boite Gmail
        </Button>
      )}
    </Box>
  );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const [redirectNoProvider, redirectNoSession] = await Promise.all([
    checkProviderToken(ctx),
    checkSession(ctx),
  ]);

  if (redirectNoProvider) {
    return redirectNoProvider;
  }
  if (redirectNoSession) {
    return redirectNoSession;
  }

  const supabase = createServerSupabaseClient(ctx);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  let hasAcceptedScope = false;

  if (session) {
    try {
      const response = await fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${session.provider_token}`);
      const responseData = await response.json();
  
      const acceptedScopes = responseData.scope.split(" ");
      const requiredScope = "https://www.googleapis.com/auth/gmail.readonly";
  
      hasAcceptedScope = acceptedScopes.includes(requiredScope);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error:", error.message || error);
      } else {
        console.error("Error:", error);
      }
      
    }
  }
  
  return {
    props: {
      hasAcceptedScope,
    },
  };
};

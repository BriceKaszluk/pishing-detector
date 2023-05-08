import React, { useEffect, lazy, Suspense, useState } from 'react';
import { GetServerSidePropsContext } from 'next';
import { checkProviderToken, checkSession } from '../services/checkAuth';
import {
  useSupabaseClient,
  useSessionContext,
} from '@supabase/auth-helpers-react';
import { Box, Button, Typography } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { useRequestAdditionalScope } from '../hooks/useRequestAdditionalScope';
import Loader from '../components/Loader';
import { useEmailsContext } from '../context/EmailsContext';
const MailList = lazy(() => import('../components/MailList'));

export default function PhishingDetector() {
  const supabaseClient = useSupabaseClient();
  const { session } = useSessionContext();
  const router = useRouter();
  const { userMails, setEmailsLoaded, setHasAcceptedScope } = useEmailsContext();
  const [hasAcceptedScope, steHasAcceptedScope] = useState(false)

  const requestAdditionalScope = useRequestAdditionalScope(
    supabaseClient,
    typeof hasAcceptedScope === 'boolean'
      ? hasAcceptedScope
      : Boolean(router.query.hasAcceptedScope),
  );

  useEffect(() => {
    async function fetchScope() {
      if (session) {
        try {
          const response = await fetch(
            `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${session.provider_token}`,
          );
          const responseData = await response.json();
    
          const acceptedScopes = responseData.scope.split(' ');
          const requiredScope = 'https://www.googleapis.com/auth/gmail.readonly';
    
          steHasAcceptedScope(acceptedScopes.includes(requiredScope));
        } catch (error) {
          if (error instanceof Error) {
            console.error('Error:', error.message || error);
          } else {
            console.error('Error:', error);
          }
        }
      }
    }
    fetchScope();
  }, [session]);

  useEffect(() => {
    const acceptedScope = hasAcceptedScope
      ? hasAcceptedScope
      : Boolean(router.query.hasAcceptedScope);

    if (acceptedScope && userMails.length < 1) {
      // Appelez setEmailsLoaded(false) pour déclencher le chargement des mails
      setHasAcceptedScope(true);
      setEmailsLoaded(false);
    }
  }, [hasAcceptedScope, router.query.hasAcceptedScope, userMails]);


  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{ width: '100%' }}
    >
      {hasAcceptedScope || router.query.hasAcceptedScope ? (
        <Box sx={{ width: '100%' }}>
          {!userMails.length ? (
            <div>
              <Typography
                variant="body1"
                color="primary"
                sx={{ margin: 'auto', width: 'fit-content', paddingBottom: "32px" }}
              >
                <CheckCircle sx={{ mr: 1, fontSize: 'inherit' }} />
                Accès autorisé à Gmail
              </Typography>
              <Loader size={50} thickness={5} />
            </div>
          ) : null}

          <Suspense fallback={<Loader />}>
            {userMails.length >= 1 ? <MailList /> : null}
          </Suspense>
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

  return {
    props: {},
  };
};

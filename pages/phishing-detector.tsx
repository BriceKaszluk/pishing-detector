import React, { useEffect } from 'react';
import { GetServerSidePropsContext } from 'next';
import dynamic from 'next/dynamic';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Box, Button, Typography } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { useEmailsContext } from '../context/EmailsContext';
import { useAcceptedScopes, AcceptedScopesProvider } from '../context/AcceptedScopesContext';
import { checkProviderToken, checkSession } from '../services/checkAuth';
import { useRequestAdditionalScope } from '../hooks/useRequestAdditionalScope';

// Utilisation de next/dynamic pour charger les composants à la demande
const MailList = dynamic(() => import('../components/MailList'));
const Loader = dynamic(() => import('../components/Loader'));

function PhishingDetector() {
  const supabaseClient = useSupabaseClient();
  const router = useRouter();
  const { userMails, setEmailsLoaded, setHasAcceptedScope } = useEmailsContext();
  const { acceptedScopeStatus, hasAcceptedScope } = useAcceptedScopes();

  const requestAdditionalScope = useRequestAdditionalScope(
    supabaseClient,
    typeof hasAcceptedScope === 'boolean'
      ? hasAcceptedScope
      : Boolean(router.query.hasAcceptedScope),
  );

  useEffect(() => {
    const acceptedScope = hasAcceptedScope
      ? hasAcceptedScope
      : Boolean(router.query.hasAcceptedScope);

    if (acceptedScope && userMails.length < 1) {
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
      {acceptedScopeStatus === 'loaded' && (hasAcceptedScope || router.query.hasAcceptedScope) ? (
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
          ) : <MailList />}

          
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

const PhishingDetectorWithProvider: React.FC = () => (
  <AcceptedScopesProvider>
    <PhishingDetector />
  </AcceptedScopesProvider>
);

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  try {
    const [redirectNoProvider, redirectNoSession] = await Promise.all([
      checkProviderToken(ctx),
      checkSession(ctx),
    ]);

    if (redirectNoProvider && typeof redirectNoProvider === 'object') {
      return redirectNoProvider;
    }
    if (redirectNoSession && typeof redirectNoSession === 'object') {
      return redirectNoSession;
    }

    return {
      props: {},
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    return {
      notFound: true,
    };
  }
};

export default PhishingDetectorWithProvider;

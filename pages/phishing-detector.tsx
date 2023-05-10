import React, { useEffect } from 'react';
import { GetServerSidePropsContext } from 'next';
import dynamic from 'next/dynamic';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Box, Button, Typography } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { useEmailsContext } from '../context/EmailsContext';
import { useAcceptedScopes, AcceptedScopesProvider } from '../context/AcceptedScopesContext';
import { checkAuth } from '../services/checkAuth';
import { useRequestAdditionalScope } from '../hooks/useRequestAdditionalScope';
import { useLoaderContext } from '../context/LoaderContext';

// Utilisation de next/dynamic pour charger les composants à la demande
const MailList = dynamic(() => import('../components/MailList'));
const Loader = dynamic(() => import('../components/Loader'));

function PhishingDetector() {
  const supabaseClient = useSupabaseClient();
  const router = useRouter();
  const { userMails, setEmailsLoaded, setHasAcceptedScope } = useEmailsContext();
  const { setLoading } = useLoaderContext();
  const { acceptedScopeStatus, hasAcceptedScope } = useAcceptedScopes();

  const requestAdditionalScope = useRequestAdditionalScope(supabaseClient, hasAcceptedScope, setLoading);

  useEffect(() => {
    const acceptedScope = hasAcceptedScope
      ? hasAcceptedScope
      : Boolean(router.query.hasAcceptedScope);

    if (acceptedScope && userMails.length < 1) {
      console.log("useEffect setEmailsLoaded phishing-detector")
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
      {userMails.length ? (
        <MailList />
      ) : (
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
      )}
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
    console.log("getServerSideProps");
    const redirectResult = await checkAuth(ctx);

    if (redirectResult && typeof redirectResult === 'object') {
      return redirectResult;
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

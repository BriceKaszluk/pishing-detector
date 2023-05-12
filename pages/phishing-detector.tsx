import React, { useEffect } from 'react';
import { GetServerSidePropsContext } from 'next';
import dynamic from 'next/dynamic';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Box, Button, Typography, Container, Card, CardContent } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
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
                <CheckCircleIcon sx={{ mr: 1, fontSize: 'inherit', color: "success" }} />
                Accès autorisé à Gmail
              </Typography>
              <Loader size={50} thickness={5} />
            </div>
          ) : <MailList />}

          
        </Box>
      ) : (
        <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Card sx={{ width: '100%', maxWidth: 'sm' }}>
          <CardContent
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              gap: 2,
              color: "primary.main"
            }}
          >
            <Typography variant="h3" component="h1">
              Nous avons besoin de votre permission
            </Typography>
            <Typography variant="body1" sx={{ color: "secondary.main" }}>
              Pour analyser vos emails et vous fournir notre service, nous avons besoin d&aposun accès supplémentaire à votre boîte Gmail. 
              Nous tenons à vous assurer que votre sécurité et votre vie privée sont notre priorité. 
              Aucune de vos données personnelles ne sera stockée ou partagée, et l&aposaccès à votre boîte de réception sera utilisé uniquement pour l&aposanalyse des emails.
            </Typography>
            <Box mt={3}>
              <Button
                variant="contained"
                color="primary"
                onClick={requestAdditionalScope}
                className="bg-button"
              >
                Autoriser l&apos;accès à ma boite Gmail
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
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

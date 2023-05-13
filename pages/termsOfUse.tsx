import React from 'react';
import { Container, Typography, Card, CardContent } from '@mui/material';
import Head from 'next/head';

const TermsOfUse: React.FC = () => {
  return (
    <div>
      <Head>
        <title>Conditions d&apos;utilisation - Phishing Detector</title>
        <meta
          name="description"
          content="Conditions d'utilisation de Phishing Detector"
        />
      </Head>

      <Container
        maxWidth="md"
        sx={{
          mb: { xs: 6, sm: 6 },
        }}
      >
        <Card variant="outlined" sx={{ marginTop: 4 }}>
          <CardContent>
            <Typography variant="h4" component="div" gutterBottom>
              Conditions d&apos;utilisation
            </Typography>

            <Typography variant="h5">1. Acceptation des conditions</Typography>
            <Typography variant="body1" mb={2}>
              En utilisant le service de détection de phishing de Phishing
              Detector, vous acceptez ces conditions d&apos;utilisation. Si vous
              n&apos;acceptez pas ces conditions, vous ne devez pas utiliser ce
              service.
            </Typography>

            <Typography variant="h5">2. Utilisation du service</Typography>
            <Typography variant="body1" mb={2}>
              Vous devez utiliser le service de détection de phishing de manière
              responsable et conformément à ces conditions et à toutes les lois
              applicables. Vous ne devez pas utiliser le service pour commettre
              une activité illégale ou pour causer des dommages ou des
              désagréments à d&apos;autres.
            </Typography>

            <Typography variant="h5">3. Disponibilité du service</Typography>
            <Typography variant="body1" mb={2}>
              Nous ne garantissons pas que le service de détection de phishing
              sera toujours disponible ou exempt d&apos;erreurs ou de défauts. Nous
              ne sommes pas responsables de toute perte ou de tout dommage que
              vous pourriez subir en raison de l&apos;indisponibilité ou du
              dysfonctionnement du service.
            </Typography>

            <Typography variant="h5">
              4. Modifications des conditions
            </Typography>
            <Typography variant="body1" mb={2}>
              Nous pouvons modifier ces conditions d&apos;utilisation de temps à
              autre. Si nous apportons des modifications, nous vous en
              informerons en mettant à jour la date en haut de ces conditions
              et, dans certains cas, nous pourrons vous fournir des
              notifications supplémentaires.
            </Typography>

            <Typography variant="h5">5. Contact</Typography>
            <Typography variant="body1">
              Si vous avez des questions sur ces conditions d&apos;utilisation,
              veuillez nous contacter à webvista.developpeur@gmail.com. Dernière mise à
              jour : 13/05/2023
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
};

export default TermsOfUse;

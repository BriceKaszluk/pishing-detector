import React from 'react';
import { Container, Typography, Card, CardContent } from '@mui/material';
import Head from 'next/head';

const PrivacyPolicy: React.FC = () => {
  return (
    <div>
      <Head>
        <title>Politique de confidentialité - Phishing Detector</title>
        <meta
          name="description"
          content="Politique de confidentialité de Phishing Detector"
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
              Politique de confidentialité
            </Typography>

            <Typography variant="h5">1. Introduction</Typography>
            <Typography variant="body1" mb={2}>
              Chez Phishing Detector, nous nous engageons à protéger la vie
              privée de nos utilisateurs. Cette politique de confidentialité
              explique comment nous recueillons, utilisons et protégeons vos
              informations lorsque vous utilisez notre service de détection de
              phishing.
            </Typography>

            <Typography variant="h5">2. Collecte d'informations</Typography>
            <Typography variant="body1" mb={2}>
              Afin d'analyser les emails pour le phishing, nous devons traiter
              le contenu de ces emails. Cependant, nous ne conservons pas ces
              emails après l'analyse. Nous ne recueillons que les informations
              nécessaires à l'identification de l'utilisateur pour des raisons
              de sécurité et de suivi.
            </Typography>

            <Typography variant="h5">
              3. Utilisation des informations
            </Typography>
            <Typography variant="body1" mb={2}>
              Les informations que nous recueillons sont utilisées pour vous
              fournir nos services de détection de phishing, pour sécuriser
              notre système, pour répondre à vos demandes ou questions, et pour
              communiquer avec vous au sujet de nos services.
            </Typography>

            <Typography variant="h5">4. Protection des informations</Typography>
            <Typography variant="body1" mb={2}>
              Nous utilisons des mesures de sécurité appropriées pour protéger
              vos informations et prévenir leur accès, divulgation, modification
              ou destruction non autorisés. Nous ne partageons pas vos
              informations avec des tiers, sauf si la loi l'exige.
            </Typography>

            <Typography variant="h5">
              5. Modifications de cette politique
            </Typography>
            <Typography variant="body1" mb={2}>
              Nous pouvons modifier cette politique de confidentialité de temps
              à autre. Si nous apportons des modifications, nous vous en
              informerons en mettant à jour la date en haut de cette politique
              et, dans certains cas, nous pourrons vous fournir des
              notifications supplémentaires.
            </Typography>

            <Typography variant="h5">6. Contact</Typography>
            <Typography variant="body1">
              Si vous avez des questions sur cette politique de confidentialité,
              veuillez nous contacter à [votre adresse email]. Dernière mise à
              jour : 13/05/2023
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
};

export default PrivacyPolicy;

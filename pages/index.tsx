import React from 'react';
import { Typography, Button, Grid } from '@mui/material';
import Link from 'next/link';
import { GetServerSidePropsContext } from 'next';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import HomeSection from '../components/HomeSection';
import HomeSection2 from '../components/HomeSection2';
import Banner from '../components/Banner';

const HomePage: React.FC = () => {
  return (
    <div>
      <div className="flex flex-col justify-center items-center text-center py-8 px-2 bg-wave w-full min-h-[90vh] md:pl-40">
        <Grid container className="min-h-[60vh]">
          <Grid
            item
            md={6}
            className="text-gray-800 text-center md:text-left flex flex-col justify-center"
          >
            <Typography
              component="h1"
              variant="h2"
              className="mb-4 capitalize"
              color="primary"
            >
              Soyez malin, pas poisson
            </Typography>
            <Typography variant="h5" sx={{ mb: 4 }}>
              Ne soyez pas l&#39;appât du jour ! Avec Phishing Detector, on fait
              le tri dans votre boîte mail et on vous donne l&#39;heure juste
              sur ces emails louches. Qui a dit que la sécurité en ligne devait
              être compliquée ? Pas nous !
            </Typography>
            <Grid container>
              <Grid item>
                <Link href="/signup" passHref>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    className="text-xl text-white bg-button"
                  >
                    Vérifier mes mails en toute simplicité
                  </Button>
                </Link>
              </Grid>
            </Grid>
          </Grid>

          <Grid
            item
            md={6}
            className="text-gray-800 flex justify-center items-center w-full mt-8"
          >
            <div className="bg-hero bg-contain bg-no-repeat w-60 h-60 md:h-5/6 md:w-6/12"></div>
          </Grid>
        </Grid>
      </div>
      <HomeSection
        title="Gardez un œil sur vos stats"
        explanation1="Rester informé n'a jamais été aussi simple avec notre tableau de bord visuel."
        explanation2="Vous y trouverez également une répartition claire des mails classés comme 'Warning', 'Safe' et 'Phishing'. Ne vous perdez plus dans les chiffres, on s'occupe de tout !"
        videoSrc="/dashboard_video.mp4"
      />
      <HomeSection2
        title="Regardez sans toucher"
        explanation1="Avec notre système, vous pouvez consulter le contenu de vos mails sans risque."
        explanation2="Ainsi, même les mails les plus douteux peuvent être examinés sans crainte. Curieux de savoir ce que contient ce message étrange ? Allez-y, on vous couvre !"
        videoSrc="/protected_mail.mp4"
      />
      <HomeSection
        title="Analyse sur commande"
        explanation1="Vous avez le contrôle. Sélectionnez les mails que vous souhaitez analyser, puis lancez l'analyse en un clic."
        explanation2="Dès que l'analyse est terminée, un symbole et un pourcentage apparaissent à côté de chaque mail pour indiquer le résultat. C'est aussi simple que ça !"
        videoSrc="/analyse_mail.mp4"
      />
      <Banner
        phrase="Prenez le contrôle, ne laissez plus les emails suspects ruiner votre tranquillité d'esprit."
        buttonText="Commencez maintenant"
        buttonLink=""
      />
    </div>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  // Create authenticated Supabase Client
  const supabase = createServerSupabaseClient(ctx);
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session)
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      },
    };
  return {
    props: {},
  };
};

export default HomePage;

import React, { useEffect } from "react";
import { Typography, Button, Container, Grid } from "@mui/material";
import Link from "next/link";
import { GetServerSidePropsContext } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/router";
import { useUser } from "@supabase/auth-helpers-react";

const HomePage: React.FC = () => {
  const router = useRouter();
  const user = useUser();

  return (
    <div className="flex flex-col justify-center items-center text-center p-8">
      <Container maxWidth="md" className="text-gray-800">
        <Typography component="h1" variant="h2" className="mb-4" color="primary">
          Protégez-vous des tentatives de phishing
        </Typography>
        <Typography variant="h5" className="mb-8">
          Détectez les menaces en ligne et sécurisez vos informations avec
          Phishing Detector. Ne tombez plus jamais dans le piège du phishing !
        </Typography>
        <Grid container justifyContent="center">
          <Grid item>
            <Link href="/signup" passHref>
              <Button
                variant="contained"
                color="primary"
                size="large"
                className="text-xl text-white bg-button"
              >
                Inscrivez-vous maintenant
              </Button>
            </Link>
          </Grid>
        </Grid>
      </Container>
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
        destination: "/dashboard",
        permanent: false,
      },
    };
  return {
    props: {},
  };
};

export default HomePage;

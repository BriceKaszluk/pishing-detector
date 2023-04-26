import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Button, Container, Grid } from "@material-ui/core";
import Link from "next/link";
import { GetServerSidePropsContext } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/router";
import { useUser } from "@supabase/auth-helpers-react";

const useStyles = makeStyles((theme) => ({
  mainContent: {
    minHeight: "calc(100vh - (64px + 260px))", // Subtracting header and footer heights
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    padding: theme.spacing(4, 0),
  },
  headline: {
    marginBottom: theme.spacing(2),
  },
  description: {
    marginBottom: theme.spacing(4),
  },
  ctaButton: {
    textTransform: "none",
    fontSize: "1.25rem",
  },
}));

const HomePage: React.FC = () => {
  const router = useRouter();
  const user = useUser();



  const classes = useStyles();

  return (
    <div className={classes.mainContent}>
      <Container maxWidth="md" className="text-gray-800">
        <Typography component="h1" variant="h2" className={classes.headline}>
          Protégez-vous des tentatives de phishing
        </Typography>
        <Typography variant="h5" className={classes.description}>
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
                className={classes.ctaButton}
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

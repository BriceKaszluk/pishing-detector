import React, { useEffect, useState } from "react";
import Link from "next/link";
import Head from "next/head";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import {
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import PhishingDetectorIcon from "@mui/icons-material/Security"; // Import the icon you want to use
import { Database } from "../lib/database.types";
import { useRouter } from "next/router";

const MainHeader: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const supabaseClient = useSupabaseClient<Database>();
  const router = useRouter();

  useEffect(() => {
    const { data: authListener } = supabaseClient.auth.onAuthStateChange(
      (_event, session) => {
        setLoggedIn(!!session);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [supabaseClient.auth]);

  const handleLogout = async () => {
    await supabaseClient.auth.signOut();
    router.push("/");
  };

  return (
    <>
      <Head>
        <title>
          Phishing Detector - Protégez-vous des tentatives de phishing
        </title>
        <meta
          name="description"
          content="Phishing Detector vous aide à détecter les tentatives de phishing et à protéger vos informations en ligne."
        />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="bg-header">
        <AppBar position="static" color="transparent" elevation={0}>
          <Toolbar>
            <Typography
              id="main_title"
              variant="h6"
              className="flex-grow"
            >
              Phishing Detector
            </Typography>
            {!loggedIn ? (
              <>
                <Button color="inherit" component={Link} href="/signup">
                  Connexion
                </Button>
              </>
            ) : (
              <>
                <IconButton color="inherit" component={Link} href="/profile">
                  <AccountCircleIcon />
                </IconButton>
                <IconButton color="inherit" component={Link} href="/dashboard">
                  <DashboardIcon />
                </IconButton>
                <IconButton color="inherit" component={Link} href="/phishing-detector">
                  <PhishingDetectorIcon />
                </IconButton>
                <IconButton color="inherit" onClick={handleLogout}>
                  <ExitToAppIcon />
                </IconButton>
              </>
            )}
          </Toolbar>
        </AppBar>
      </div>
    </>
  );
};

export default MainHeader;

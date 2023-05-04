import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider, Session } from "@supabase/auth-helpers-react";
import { useState } from "react";
import "../styles/globals.css";
import MainLayout from "../components/MainLayout";
import { AppProps } from "next/app";
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0077c2', // Bleu primaire
    },
    secondary: {
      main: '#273142', // Bleu foncé (principale couleur secondaire)
      dark: '#1d2533', // Bleu très foncé
    },
    info: {
      main: '#E6F2FF', // Bleu très clair (couleur d'information)
    },
  },
});


export default function MyApp({
  Component,
  pageProps,
}: AppProps<{
  initialSession: Session;
}>) {
  // Create a new supabase browser client on every first render.
  const [supabaseClient] = useState(() => createBrowserSupabaseClient());
  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <ThemeProvider theme={theme}>
          <MainLayout>
            <Component {...pageProps} />
          </MainLayout>
      </ThemeProvider>
    </SessionContextProvider>
  );
}

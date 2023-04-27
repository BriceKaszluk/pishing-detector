import React, { useState } from "react";
import {
  createServerSupabaseClient,
  User,
} from "@supabase/auth-helpers-nextjs";
import { GetServerSidePropsContext } from "next";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import axios from "axios"

export default function Dashboard({
  hasAcceptedScope,
}: {
  hasAcceptedScope: boolean;
}) {
  const supabaseClient = useSupabaseClient();

  async function requestAdditionalScope() {
    if (!hasAcceptedScope) {
      try {
        const { error: additionalScopeError } =
          await supabaseClient.auth.signInWithOAuth({
            provider: "google",
            options: {
              scopes: "https://www.googleapis.com/auth/gmail.readonly",
              redirectTo: `${process.env.NEXT_PUBLIC_HOSTNAME}/phishing-detector?isConnected=1`,
            },
          });
      
        if (additionalScopeError) {
          throw additionalScopeError;
        } else {
          console.log("Additional scope requested successfully");
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error requesting additional scope:", error.message);
        } else {
          console.error("Error requesting additional scope:", error);
        }
      }      
    }
  }

  return (
    <div>
      <button className="w-4 h-4" onClick={requestAdditionalScope}>
        {" "}
        add scope
      </button>
    </div>
  );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { query } = ctx;
  const isConnected = query.isConnected;
  // Create authenticated Supabase Client
  const supabase = createServerSupabaseClient(ctx);
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session && !isConnected)
    return {
      redirect: {
        destination: "/signup",
        permanent: false,
      },
    };

  let hasAcceptedScope = false;

  try {
    const response = await axios.get(
      `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${session.provider_token}`
    );

    const acceptedScopes = response.data.scope.split(" ");
    const requiredScope = "https://www.googleapis.com/auth/gmail.readonly";

    if (acceptedScopes.includes(requiredScope)) {
      console.log("il est déjà accepté", response.data);
      hasAcceptedScope = true;
    } else {
      console.log("il n'as pas encore accepté", response.data);
      hasAcceptedScope = false;
    }
  } catch (error) {
    console.error("Error:", error.message);
  }

  return {
    props: {
      hasAcceptedScope,
    },
  };
};

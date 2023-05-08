import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

export const checkProviderToken = async (
  ctx: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<{}> | false> => {
  try {
    const { resolvedUrl } = ctx;

    const restrictedUrls = ["dashboard", "phishing-detector", "profil"];

    const supabase = createServerSupabaseClient(ctx);
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const shouldSignInWithGoogle = restrictedUrls.some((url) =>
      resolvedUrl.includes(url)
    );

    if (
      shouldSignInWithGoogle &&
      session &&
      !session.provider_token &&
      !session.provider_refresh_token
    ) {
      return {
        redirect: {
          destination: "/signup?refresh=true",
          permanent: false,
        },
      };
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error in checkProviderToken:', error);
    return false;
  }
};

export const checkSession = async (
  ctx: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<{}> | false> => {
  try {
    const isConnected = ctx.query.isConnected;

    // Create authenticated Supabase Client
    const supabase = createServerSupabaseClient(ctx);

    // Check if we have a session
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session && !isConnected) {
      return {
        redirect: {
          destination: "/signup",
          permanent: false,
        },
        props: {},
      };
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error in checkSession:', error);
    return false;
  }
};

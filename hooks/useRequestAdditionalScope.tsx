import { useCallback } from "react";
import { SupabaseClient } from "@supabase/supabase-js";

export const useRequestAdditionalScope = (
  supabaseClient: SupabaseClient,
  hasAcceptedScope: boolean
) => {
  const requestAdditionalScope = useCallback(async () => {
    if (!hasAcceptedScope) {
      try {
        const { error: additionalScopeError } =
          await supabaseClient.auth.signInWithOAuth({
            provider: "google",
            options: {
              scopes: "https://www.googleapis.com/auth/gmail.readonly",
              redirectTo: `${process.env.NEXT_PUBLIC_HOSTNAME}/phishing-detector?isConnected=true&hasAcceptedScope=true`,
              queryParams: {
                access_type: "offline",
              },
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
  }, [supabaseClient, hasAcceptedScope]);

  return requestAdditionalScope;
};

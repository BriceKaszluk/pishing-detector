import {
  useSessionContext,
  useSupabaseClient,
  useUser,
} from "@supabase/auth-helpers-react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";

const SignUpPage: NextPage = () => {
  const { isLoading, session } = useSessionContext();
  const user = useUser();
  const supabaseClient = useSupabaseClient();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  if (!session) {
    return (
      <>
        {isLoading ? <h1>Loading...</h1> : ""}
        <div className="md:w-4/12 m-auto px-4 min-h-main flex flex-col justify-center">
          <Auth
            redirectTo="/dashboard"
            appearance={{ theme: ThemeSupa,
              className: {
                message: 'text-gray-800',
              },
              variables: {
                default: {
                  colors: {
                    brand: '#0077c2',
                    brandAccent: '#005387',
                    inputLabelText: "#1F2937",
                    anchorTextColor: "#1F2937",
                    messageText: "#1F2937",
                  },
                },
              },
            }}
            localization={{
              variables: {
                "sign_up": {
                  "email_label": "Adresse e-mail",
                  "password_label": "Créer un mot de passe",
                  "email_input_placeholder": "Votre adresse e-mail",
                  "password_input_placeholder": "Votre mot de passe",
                  "button_label": "S'inscrire",
                  "loading_button_label": "Inscription en cours ...",
                  "social_provider_text": "Se connecter avec {{provider}}",
                  "link_text": "Vous n'avez pas de compte? S'inscrire",
                  "confirmation_text": "Vérifiez votre e-mail pour le lien de confirmation"
                },
                "sign_in": {
                  "email_label": "Adresse e-mail",
                  "password_label": "Votre mot de passe",
                  "email_input_placeholder": "Votre adresse e-mail",
                  "password_input_placeholder": "Votre mot de passe",
                  "button_label": "Se connecter",
                  "loading_button_label": "Connexion en cours ...",
                  "social_provider_text": "Se connecter avec {{provider}}",
                  "link_text": "Vous avez déjà un compte? Se connecter"
                },
                "magic_link": {
                  "email_input_label": "Adresse e-mail",
                  "email_input_placeholder": "Votre adresse e-mail",
                  "button_label": "Envoyer un lien magique",
                  "loading_button_label": "Envoi du lien magique ...",
                  "link_text": "Envoyer un e-mail avec un lien magique",
                  "confirmation_text": "Vérifiez votre e-mail pour le lien magique"
                },
                "forgotten_password": {
                  "email_label": "Adresse e-mail",
                  "password_label": "Votre mot de passe",
                  "email_input_placeholder": "Votre adresse e-mail",
                  "button_label": "Envoyer des instructions pour réinitialiser le mot de passe",
                  "loading_button_label": "Envoi des instructions de réinitialisation ...",
                  "link_text": "Mot de passe oublié?",
                  "confirmation_text": "Vérifiez votre e-mail pour le lien de réinitialisation du mot de passe"
                },
                "update_password": {
                  "password_label": "Nouveau mot de passe",
                  "password_input_placeholder": "Votre nouveau mot de passe",
                  "button_label": "Mettre à jour le mot de passe",
                  "loading_button_label": "Mise à jour du mot de passe ...",
                  "confirmation_text": "Votre mot de passe a été mis à jour"
                }
              
              },
            }}
            supabaseClient={supabaseClient}
            providers={["google"]}
            socialLayout="horizontal"
          />
        </div>
      </>
    );
  }

  return (
    <>
      {isLoading ? <h1>Loading...</h1> : ""}
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </>
  );
};

export default SignUpPage;

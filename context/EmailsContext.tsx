import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { Mail } from "../lib/types";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "../lib/types";

interface EmailsContextValue {
  userMails: UserMail[];
  setEmailsLoaded: (loaded: boolean) => void;
  updateEmailsWithProbabilities: (
    probabilitiesWithIds: { emailId: string; label: string; phishingScore: number }[]
  ) => void;
  setHasAcceptedScope: React.Dispatch<React.SetStateAction<boolean>>;
}


type UserMail = Mail & {
  id: string;
  threadId: string;
  snippet: string;
  internalDate: string;
  labelIds: string[];
  subject: string;
  from: string;
  body: string;
  attachments: string[];
};

const EmailsContext = createContext<EmailsContextValue | undefined>(undefined);


export const EmailsProvider: React.FC<{}> = ({
  children,
}) => {
  const [hasAcceptedScope, setHasAcceptedScope] = useState(false);
  const [userMails, setUserMails] = useState<UserMail[]>([]);
  const [emailsLoaded, setEmailsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { session } = useSessionContext();
  const supabaseClient = useSupabaseClient<Database>();

  const loadStoredPhishingScores = async (user_id: string) => {
    const { data, error } = await supabaseClient
      .from('phishing_scores')
      .select('*')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false })
      .limit(40);
    console.log(data, "data")
    if (error) {
      console.error('Error loading stored phishing scores:', error.message);
      return [];
    }
    return data || [];
  };
  
  

  const getEmailsFromLastWeekAndUpdateState = useCallback(async () => {
    if (session && !isLoading) {
      setIsLoading(true);
      try {
        const response = await fetch("/api/getMailsList");
        if (response.ok) {
          const data = await response.json();
          const storedPhishingScores = await loadStoredPhishingScores(session.user.id);
  
          // Map stored phishing scores to emails
          const emailsWithPhishingScores = data.emails.map((email: UserMail) => {
            const storedScore = storedPhishingScores.find(
              (score: any) => score.email_id === email.id
            );
  
            if (storedScore) {
              return {
                ...email,
                phishingLabel: storedScore.label,
                phishingScore: storedScore.phishing_score,
              };
            }
            return email;
          });
  
          setUserMails(emailsWithPhishingScores);
          setEmailsLoaded(true);
        } else {
          console.error("Failed to fetch emails:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching emails:", error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [session]);
  

  useEffect(() => {
    if (hasAcceptedScope && !emailsLoaded) {
      getEmailsFromLastWeekAndUpdateState();
    }
  }, [hasAcceptedScope, emailsLoaded, session]);

  const updateEmailsWithProbabilities = useCallback(
    (probabilitiesWithIds: { emailId: string; label: string; phishingScore: number }[]) => {
      const updatedMails = userMails.map((mail) => {
        const probabilityWithId = probabilitiesWithIds.find((p) => p.emailId === mail.id);
        if (probabilityWithId) {
          return {
            ...mail,
            phishingLabel: probabilityWithId.label,
            phishingScore: probabilityWithId.phishingScore,
          };
        } else {
          return mail;
        }
      });
      console.log(updatedMails, "updateEmailsWithProbabilities")
      setUserMails(updatedMails);
    },
    [userMails]
  );
  
  
  

  const value = {
    userMails,
    setEmailsLoaded,
    updateEmailsWithProbabilities,
    setHasAcceptedScope,
  };

  return (
    <EmailsContext.Provider value={value}>{children}</EmailsContext.Provider>
  );
};

export const useEmailsContext = () => {
  const context = useContext(EmailsContext);
  if (context === undefined) {
    throw new Error("useEmailsContext must be used within an EmailsProvider");
  }
  return context;
};

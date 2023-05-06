import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { Mail } from "../lib/types";
import { useSessionContext } from "@supabase/auth-helpers-react";

interface EmailsContextValue {
  userMails: UserMail[];
  setEmailsLoaded: (loaded: boolean) => void;
  updateEmailsWithProbabilities: (
    probabilitiesWithIds: { id: string; phishingLabel: string; phishingScore: number }[]
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

  const getEmailsFromLastWeekAndUpdateState = useCallback(async () => {
    if (session && !isLoading) {
      setIsLoading(true);
      try {
        const response = await fetch("/api/getMailsList");
        if (response.ok) {
          const data = await response.json();

          setUserMails(data.emails);
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

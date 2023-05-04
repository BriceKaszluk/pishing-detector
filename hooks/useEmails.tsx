import { useState, useEffect, useCallback } from "react";
import { Mail } from "../lib/database.types";

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

export const useEmails = (session: any, hasAcceptedScope: boolean): [UserMail[], (loaded: boolean) => void] => {
  const [userMails, setUserMails] = useState<UserMail[]>([]);
  const [emailsLoaded, setEmailsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  return [userMails, setEmailsLoaded];
};

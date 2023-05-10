export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {};
    Functions: {};
  };
}

export interface Mail {
  id: string;
  threadId: string;
  snippet: string;
  internalDate: string;
  labelIds: string[];
  from: string;
  subject: string;
  textBody: string;
  htmlBody: string;
  attachments: string[];
  phishingLabel?: string;
  phishingScore?: number;
}


export type PhishingScore = {
  emailId: string;
  phishingScore: number;
  label: string;
  features?: Record<string, unknown> | null; // indicates optional and of type jsonb
};

export interface UserStatistics {
  user_id: string;
  total_emails_week: number;
  total_emails_all_time: number;
  safe_week: number;
  warning_week: number;
  danger_week: number;
  safe_all_time: number;
  warning_all_time: number;
  danger_all_time: number;
}

export function isUserStatistics(obj: any): obj is UserStatistics {
  return (
    obj &&
    typeof obj.user_id === "string" &&
    typeof obj.total_emails_week === "number" &&
    typeof obj.total_emails_all_time === "number" &&
    typeof obj.safe_week === "number" &&
    typeof obj.warning_week === "number" &&
    typeof obj.danger_week === "number" &&
    typeof obj.safe_all_time === "number" &&
    typeof obj.warning_all_time === "number" &&
    typeof obj.danger_all_time === "number"
  );
}


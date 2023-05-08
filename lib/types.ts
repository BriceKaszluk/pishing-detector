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

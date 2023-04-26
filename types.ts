export type Email = {
  id: string;
  subject: string;
  snippet: string;
  attachmentsCount: number;
  threadId: string;
  labelIds: string[];
  historyId: string;
  internalDate: string;
  payload: {
    partId: string;
    mimeType: string;
    filename: string;
    headers: {
      name: string;
      value: string;
    }[];
    body: {
      size: number;
      data: string;
    };
    parts: any[];
  };
  sizeEstimate: number;
};

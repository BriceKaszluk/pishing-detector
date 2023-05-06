import { google, Auth, gmail_v1 } from "googleapis";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { Mail } from "../lib/types";

const clientId = process.env.GOOGLE_CLIENT_ID!;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET!;
const redirectUri = process.env.GOOGLE_REDIRECT_URI!;

export const createOAuth2Client = (): Auth.OAuth2Client => {
  const client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
  return client;
};

export const getGmailClient = (auth: Auth.OAuth2Client): gmail_v1.Gmail => {
  return google.gmail({ version: "v1", auth });
};

const createBatchRequest = (
  emailIds: string[],
  accessToken: string
): AxiosRequestConfig => {
  const gmailApiVersion = "v1";
  const boundary = "batch_boundary";
  const baseUrl = `/gmail/${gmailApiVersion}/users/me/messages/`;

  // Créez les parties individuelles de la requête
  const parts = emailIds.map((id, index) => {
    return (
      `Content-Type: application/http\n` +
      `Content-ID: <item${index + 1}:123456@myapp.example.com>\n` +
      `Content-Transfer-Encoding: binary\n\n` +
      `GET ${baseUrl}${id}\n`
    );
  });

  // Créez la requête par lot avec les parties
  const batchRequest =
    `--${boundary}\n` + parts.join(`\n--${boundary}\n`) + `\n--${boundary}--\n`;

  // Créez la configuration de la requête axios
  const axiosConfig: AxiosRequestConfig = {
    method: "POST",
    url: `https://www.googleapis.com/batch/gmail/${gmailApiVersion}`,
    headers: {
      "Content-Type": `multipart/mixed; boundary=${boundary}`,
      Authorization: `Bearer ${accessToken}`,
    },
    data: batchRequest,
  };

  return axiosConfig;
};

const processBatchResponse = (response: AxiosResponse) => {
  const contentType = response.headers["content-type"];
  const boundaryMatch = contentType.match(/boundary=(.+);?/);
  const uniqueBoundary = boundaryMatch && boundaryMatch[1];

  const responseParts = response.data.split(`--${uniqueBoundary}`);

  const messages: gmail_v1.Schema$Message[] = [];
  for (const part of responseParts) {
    const match = part.match(/({[\s\S]*})/);
    if (match && match[1]) {
      try {
        const message = JSON.parse(match[1]) as gmail_v1.Schema$Message;
        messages.push(message);
      } catch (error) {
        // Ignore the error and continue to the next part
        continue;
      }
    }
  }

  return messages;
};

export const getEmailsFromLastWeek = async (
  accessToken: string
): Promise<Mail[]> => {
  const authClient = createOAuth2Client();
  authClient.setCredentials({ access_token: accessToken });
  const gmail = getGmailClient(authClient);

  try {
    const listRes = await gmail.users.messages.list({
      userId: "me",
      labelIds: ["INBOX"],
      maxResults: 30,
    });

    if (!listRes.data.messages) {
      return [];
    }
    // Récupérer les ID des e-mails
    const emailIds = listRes.data.messages.map((email) => email.id!);

    // Créez et envoyez une requête par lot
    const batchRequestConfig = createBatchRequest(emailIds, accessToken);
    const batchResponse = await axios.request(batchRequestConfig);

    // Traitez la réponse et extrayez les messages
    const messages = processBatchResponse(batchResponse);

    // Récupérer les e-mails complets avec toutes les informations
    const getEmailPromises = messages.map((message) =>
      gmail.users.messages.get({ userId: "me", id: message.id!, format: "full" })
    );
    const emailResponses = await Promise.all(getEmailPromises);

// Traiter les e-mails pour extraire les informations nécessaires
const mails: Mail[] = emailResponses.map((response) => {
  const mail = response.data;
  const payload = mail.payload!;

  const headers = payload.headers!;
  const fromHeader = headers.find((header) => header.name === "From")!;
  const subjectHeader = headers.find((header) => header.name === "Subject")!;

  const textPart = payload.parts?.find((part) => part.mimeType === "text/plain");
  const htmlPart = payload.parts?.find((part) => part.mimeType === "text/html");

  const textBody = textPart?.body?.data || "";
const htmlBody = htmlPart?.body?.data || "";

  const attachments = payload.parts
    ? payload.parts
        .filter((part) => part.filename && part.filename.length > 0)
        .map((part) => part.filename)
        .filter((filename): filename is string => filename !== null && filename !== undefined)
    : [];

    return {
      id: mail.id!,
      threadId: mail.threadId!,
      snippet: mail.snippet!,
      internalDate: mail.internalDate!,
      labelIds: mail.labelIds!,
      from: fromHeader.value!,
      subject: subjectHeader.value!,
      textBody: Buffer.from(textBody, "base64").toString("utf-8"),
      htmlBody: Buffer.from(htmlBody, "base64").toString("utf-8"),
      attachments: attachments,
    };    
});





    return mails;
  } catch (error) {
    console.error("Failed to fetch emails from last week:", error);
    return [];
  }
};

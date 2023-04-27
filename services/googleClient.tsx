import { google, Auth, gmail_v1 } from "googleapis";
import axios, { AxiosRequestConfig } from "axios";

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

export const getEmailsFromLastWeek = async (
  accessToken: string
): Promise<gmail_v1.Schema$Message[]> => {
  const authClient = createOAuth2Client();
  authClient.setCredentials({ access_token: accessToken });
  const gmail = getGmailClient(authClient);

  try {
    const listRes = await gmail.users.messages.list({
      userId: "me",
      labelIds: ["INBOX"],
      maxResults: 3,
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
    const contentType = batchResponse.headers["content-type"];
    const boundaryMatch = contentType.match(/boundary=(.+);?/);
    const uniqueBoundary = boundaryMatch && boundaryMatch[1];

    const responseParts = batchResponse.data.split(`--${uniqueBoundary}`);

    const emails: gmail_v1.Schema$Message[] = [];
    for (const part of responseParts) {
      const match = part.match(/({[\s\S]*})/);
      if (match && match[1]) {
        try {
          const message = JSON.parse(match[1]) as gmail_v1.Schema$Message;
          emails.push(message);
        } catch (error) {
          console.error("Failed to parse email message, skipping:", error);
          // Vous pouvez également ajouter la chaîne JSON problématique pour faciliter le débogage
          console.error("Invalid JSON string:", match[1]);
          // Ignorer le message et passer au suivant
          continue;
        }
      }
    }
    return emails;
  } catch (error) {
    console.error("Failed to fetch emails from last week:", error);
    return [];
  }
};

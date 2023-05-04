// pages/api/process_emails.ts
import { loadModel } from "./loadModel";
import { predict } from "./predict";
import "@tensorflow/tfjs-node";
import { NextApiHandler } from "next";

interface ProcessedMail extends Mail {
  NumDots: number[];
  SubdomainLevel: number;
  PathLevel: number[];
  UrlLength: number[];
  NumDash: number[];
}

interface Mail {
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
}

const extractUrls = (htmlBody: string): string[] => {
  const regex = /https?:\/\/[^\s]+/g;
  return htmlBody.match(regex) || [];
};

const countDotsInUrl = (url: string): number => {
  return (url.match(/\./g) || []).length;
};

const subdomainLevel = (email: string): number => {
  const domain = email.split("@")[1];
  return domain.split(".").length - 1;
};

const pathLevel = (url: string): number => {
  const path = new URL(url).pathname;
  return path === '/' ? 0 : path.split("/").length - 1;
};

const countDashesInUrl = (url: string): number => {
  return (url.match(/-/g) || []).length;
};

const processEmails = (emails: Mail[]): ProcessedMail[] => {
  console.log("processEmails")
  return emails.map((email) => {
    const urls = extractUrls(email.htmlBody);
    const numDots = urls.map(countDotsInUrl);
    const numDash = urls.map(countDashesInUrl);
    const pathLevels = urls.map(pathLevel);

    return {
      ...email,
      NumDots: numDots,
      SubdomainLevel: subdomainLevel(email.from),
      PathLevel: pathLevels,
      UrlLength: urls.map((url) => url.length),
      NumDash: numDash,
    };
  });
};


const handler: NextApiHandler = async (req, res) => {
  console.log("in handler")
  if (req.method === "POST") {
    const emails = req.body.emails as Mail[];

    if (!emails) {
      res.status(400).json({ error: "Emails are required" });
      return;
    }

    const processedEmails = processEmails(emails);
    const model = await loadModel();
    const phishingProbabilities = await Promise.all(
      processedEmails.map((emailFeatures) => predict(model, emailFeatures))
    );

    res.status(200).json({ phishingProbabilities });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;

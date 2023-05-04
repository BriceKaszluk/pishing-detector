// pages/api/predict.ts
import { LayersModel, Tensor, tensor2d } from "@tensorflow/tfjs";

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

const sum = (arr: number[]): number => arr.reduce((a, b) => a + b, 0);

const mailFeaturesToArray = (email: ProcessedMail): number[] => {
  console.log("mailFeaturesToArray")
  // Utilisez la fonction sum() pour convertir les tableaux de nombres en un seul nombre
  const featuresArray = [
    parseInt(email.id), // En supposant que l'ID est un nombre, sinon vous devez le convertir en un nombre ou le supprimer
    sum(email.NumDots),
    email.SubdomainLevel,
    sum(email.PathLevel),
    sum(email.UrlLength),
    sum(email.NumDash),
    // Ajoutez ici les autres caractéristiques extraites
    0, // NumDashInHostname
    0, // AtSymbol
    0, // TildeSymbol
    0, // NumUnderscore
    0, // NumPercent
    0, // NumQueryComponents
    0, // NumAmpersand
    0, // NumHash
    0, // NumNumericChars
    0, // NoHttps
    0, // RandomString
    0, // IpAddress
    0, // DomainInSubdomains
    0, // DomainInPaths
    0, // HttpsInHostname
    0, // HostnameLength
    0, // PathLength
    0, // QueryLength
    0, // DoubleSlashInPath
    0, // NumSensitiveWords
    0, // EmbeddedBrandName
    0, // PctExtHyperlinks
    0, // PctExtResourceUrls
    0, // ExtFavicon
    0, // InsecureForms
    0, // RelativeFormAction
    0, // ExtFormAction
    0, // AbnormalFormAction
    0, // PctNullSelfRedirectHyperlinks
    0, // FrequentDomainNameMismatch
    0, // FakeLinkInStatusBar
    0, // RightClickDisabled
    0, // PopUpWindow
    0, // SubmitInfoToEmail
    0, // IframeOrFrame
    0, // MissingTitle
    0, // ImagesOnlyInForm
    0, // SubdomainLevelRT
    0, // UrlLengthRT
    0, // PctExtResourceUrlsRT
    0, // AbnormalExtFormActionR
    0, // ExtMetaScriptLinkRT
    0, // PctExtNullSelfRedirectHyperlinksRT

  ];

  return featuresArray;
};

export const predict = async (model: LayersModel, emailFeatures: ProcessedMail): Promise<number> => {
  const featuresArray = mailFeaturesToArray(emailFeatures);
  const inputTensor = tensor2d([featuresArray]);
  const prediction = model.predict(inputTensor);
  const phishingProbability = (prediction as Tensor).dataSync()[0];

  return phishingProbability;
};

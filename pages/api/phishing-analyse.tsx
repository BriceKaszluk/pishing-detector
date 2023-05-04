// pages/api/process_emails.ts
import { tensor2d, Tensor } from "@tensorflow/tfjs-core";
import { loadLayersModel, LayersModel } from "@tensorflow/tfjs-layers";

import "@tensorflow/tfjs-node";
import { NextApiHandler } from "next";





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








const loadModel = async (): Promise<LayersModel> => {
  const model = await loadLayersModel("file://./public/mon_modele_tfjs/model.json");
  return model;
};

const predict = async (model: LayersModel, emailFeatures: ProcessedMail): Promise<number> => {
  const featuresArray = mailFeaturesToArray(emailFeatures);
  const inputTensor = tensor2d([featuresArray]);
  const prediction = model.predict(inputTensor);
  const phishingProbability = (prediction as Tensor).dataSync()[0];

  return phishingProbability;
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

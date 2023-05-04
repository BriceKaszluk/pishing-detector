// pages/api/loadModel.ts
import { LayersModel } from "@tensorflow/tfjs";
import "@tensorflow/tfjs-node";
import { loadLayersModel } from "@tensorflow/tfjs";

export const loadModel = async (): Promise<LayersModel> => {
  const model = await loadLayersModel("file://./public/mon_modele_tfjs/model.json");
  return model;
};

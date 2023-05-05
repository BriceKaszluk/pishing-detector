import * as functions from "firebase-functions";
import {loadModel} from "./loadModel";
import {predict} from "./predict";
import {LayersModel} from "@tensorflow/tfjs";

let model: LayersModel | null = null;

// Fonction pour charger le modèle
export const loadModelFunction = functions.https.onRequest(async (req, res) => {
  try {
    model = await loadModel();
    res.status(200).send("Model loaded successfully");
  } catch (error) {
    if (typeof error === "string") {
      throw new Error(`Error loading model: ${error}`);
    } else if (error instanceof Error) {
      throw new Error(`Error loading model: ${error.message}`);
    } else {
      throw new Error(`Unknown error loading model: ${JSON.stringify(error)}`);
    }
  }
});

// Fonction pour effectuer une prédiction
export const predictFunction = functions.https.onRequest(async (req, res) => {
  try {
    if (!model) {
      res.status(400).send("Model not loaded");
      return;
    }

    const emailFeatures = req.body.emailFeatures;

    if (!emailFeatures) {
      res.status(400).send("Email features are required");
      return;
    }

    const phishingProbability = await predict(model, emailFeatures);
    res.status(200).send({phishingProbability});
  } catch (error) {
    if (typeof error === "string") {
      throw new Error(`Error making prediction: ${error}`);
    } else if (error instanceof Error) {
      throw new Error(`Error making prediction: ${error.message}`);
    } else {
      throw new Error(
          `Unknown Error making prediction: ${JSON.stringify(error)}`
      );
    }
  }
});

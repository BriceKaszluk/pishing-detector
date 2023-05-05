import { LayersModel, loadLayersModel } from '@tensorflow/tfjs-node';

export const loadModel = async (): Promise<LayersModel> => {
  const model = await loadLayersModel(
    'file://./public/mon_modele_tfjs/model.json',
  );
  return model;
};

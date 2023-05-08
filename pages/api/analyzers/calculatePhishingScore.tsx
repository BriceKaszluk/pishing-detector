import { Mail, PhishingScore } from '../../../lib/types';
import { extractFeatures } from './extractFeatures';

export const calculatePhishingScore = (email: Mail): PhishingScore => {
  const features = extractFeatures(email);
  let phishingScore = 0;

  // Add custom scoring logic based on the extracted features
  if (features.NoHttps > 0) {
    phishingScore += 10;
  }
  if (features.NumSensitiveWords > 0) {
    phishingScore += 20;
  }
  if (features.MissingTitle) {
    phishingScore += 5;
  }
  if (features.HostnameLength > 50) {
    phishingScore += 10;
  }
  if (features.IpAddress.toString().length > 0) {
    phishingScore += 15;
  }
  if (features.SubdomainLevel > 3) {
    phishingScore += 5;
  }
  if (features.SumNumDots > 50) {
    phishingScore += 5;
  }
  if (features.UrlFeatureValues.some((urlFeature) => urlFeature.numQueryComponents > 5)) {
    phishingScore += 10;
  }
  if (features.UrlFeatureValues.some((urlFeature) => urlFeature.numUnderscore > 10)) {
    phishingScore += 5;
  }

  // Add scoring logic for additional features
  if (features.AtSymbol > 5) {
    phishingScore += 5;
  }
  if (features.TildeSymbol > 0) {
    phishingScore += 5;
  }
  if (features.NumPercent > 10) {
    phishingScore += 5;
  }
  if (features.NumAmpersand > 10) {
    phishingScore += 5;
  }
  if (features.NumHash > 5) {
    phishingScore += 5;
  }
  if (features.NumNumericChars > 30) {
    phishingScore += 5;
  }

  // Normalize the phishing score
  const normalizedPhishingScore = Math.min(phishingScore, 100);

  // Assign a label based on the phishing score
  let label = 'safe';
  if (normalizedPhishingScore >= 75) {
    label = 'danger';
  } else if (normalizedPhishingScore >= 50) {
    label = 'warning';
  }

  return {
    emailId: email.id,
    phishingScore: normalizedPhishingScore,
    label,
    features,
  };
};

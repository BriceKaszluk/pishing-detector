import { Mail } from '../../../lib/types';
import * as url from 'url';

const extractUrls = (text: string): string[] => {
  const urlRegex = /https?:\/\/[^\s]+/g;
  return text.match(urlRegex) || [];
};

const extractIpAddress = (text: string): string[] => {
  const ipRegex = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g;
  return text.match(ipRegex) || [];
};

export const extractFeatures = (email: Mail) => {
  const body = email.textBody || email.htmlBody || '';
  const urls = extractUrls(body);
  const ipAddresses = extractIpAddress(body);
  const hostname = email.from.split('@')[1];
  const subdomainLevel = hostname.split('.').length - 1;
  const hostnameLength = hostname.length;

  const urlFeatureValues = urls.map((urlStr) => {
    const parsedUrl = url.parse(urlStr);
    const numQueryComponents = parsedUrl.query?.split('&').length || 0;
    const numUnderscore = (parsedUrl.pathname?.match(/_/g) || []).length;
    return {
      numQueryComponents,
      numUnderscore,
    };
  });

  const sumNumDots = (body.match(/\./g) || []).length;

  const features = {
    AtSymbol: (body.match(/@/g) || []).length,
    TildeSymbol: (body.match(/~/g) || []).length,
    NumUnderscore: (body.match(/_/g) || []).length,
    NumPercent: (body.match(/%/g) || []).length,
    NumAmpersand: (body.match(/&/g) || []).length,
    NumHash: (body.match(/#/g) || []).length,
    NumNumericChars: (body.match(/\d/g) || []).length,
    NoHttps: urls.filter((urlStr) => urlStr.startsWith('http://')).length,
    IpAddress: ipAddresses.length,
    NumSensitiveWords: (body.match(/\b(password|login|username|account)\b/gi) || []).length,
    MissingTitle: !email.subject || email.subject.trim() === '',
    HostnameLength: hostnameLength,
    SubdomainLevel: subdomainLevel,
    SumNumDots: sumNumDots,
    UrlFeatureValues: urlFeatureValues,
  };

  return features;
};

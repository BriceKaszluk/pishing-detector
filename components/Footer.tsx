import React from "react";
import { Typography, Grid, Link } from "@mui/material";

const Footer: React.FC = () => {
  return (
    <footer className="bg-footer py-12 mt-auto">
      <div className="container mx-auto px-4">
        <Grid container spacing={4} justifyContent="space-evenly">
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" className="text-white mb-4">
              Phishing Detector
            </Typography>
            <Typography variant="subtitle1" className="text-white">
              Protégez-vous des tentatives de phishing et sécurisez vos
              informations en ligne.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" className="text-white mb-4">
              Liens utiles
            </Typography>
            <ul>
              <li>
                <Link href="/profil" className="text-white">
                  Profil
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-white">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/phishing-detector" className="text-white">
                  Phishing Detector
                </Link>
              </li>
            </ul>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" className="text-white mb-4">
              Aide et support
            </Typography>
            <ul>
              <li>
                <Link href="/termsOfUse" className="text-white">
                  Conditions d&apos;utilisation
                </Link>
              </li>
              <li>
                <Link href="/privacyPolicy" className="text-white">
                  Politique de confidentialité
                </Link>
              </li>
            </ul>
          </Grid>
        </Grid>
        <div className="mt-6">
          <Typography variant="body2" align="center" className="text-white">
            © {new Date().getFullYear()} Phishing Detector. Tous droits
            réservés.
          </Typography>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

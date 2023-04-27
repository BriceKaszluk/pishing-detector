import React from "react";
import { makeStyles } from "@mui/styles";
import { Typography, Grid, Link } from "@mui/material";
import { Theme } from '@mui/material/styles';

const useStyles = makeStyles<Theme>((theme) => ({
  footer: {
    marginTop: "auto",
  },
  link: {
    color: "#ffffff",
  },
}));

const Footer: React.FC = () => {
  const classes = useStyles();

  return (
    <footer className={`${classes.footer} bg-footer`}>
      <div className="container mx-auto px-4">
        <Grid container spacing={4} justifyContent="space-evenly">
          <Grid item xs={12} sm={6} md={3}>
            <Typography
              variant="h6"
              className={`${classes.link}`}
            >
              Phishing Detector
            </Typography>
            <Typography variant="subtitle1" className={classes.link}>
              Protégez-vous des tentatives de phishing et sécurisez vos
              informations en ligne.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography
              variant="h6"
              className={`${classes.link}`}
            >
              Liens utiles
            </Typography>
            <ul>
              <li>
                <Link href="/about" className={classes.link}>
                  À propos
                </Link>
              </li>
              <li>
                <Link href="/contact" className={classes.link}>
                  Contact
                </Link>
              </li>
            </ul>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography
              variant="h6"
              className={`${classes.link}`}
            >
              Aide et support
            </Typography>
            <ul>
              <li>
                <Link href="/faq" className={classes.link}>
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/terms" className={classes.link}>
                  Conditions d'utilisation
                </Link>
              </li>
              <li>
                <Link href="/privacy" className={classes.link}>
                  Politique de confidentialité
                </Link>
              </li>
            </ul>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography
              variant="h6"
              className={`${classes.link}`}
            >
              Nous suivre
            </Typography>
            <ul>
              <li>
                <Link
                  href="https://twitter.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={classes.link}
                >
                  Twitter
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.linkedin.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={classes.link}
                >
                  LinkedIn
                </Link>
              </li>
            </ul>
          </Grid>
        </Grid>
        <div className="mt-6">
        <Typography
          variant="body2"
          align="center"
          className={`${classes.link}`}
        >
          © {new Date().getFullYear()} Phishing Detector. Tous droits réservés.
        </Typography>
        </div>

      </div>
    </footer>
  );
};

export default Footer;

import React from "react";
import Typography from "@mui/material/Typography";
import { Mail } from "../lib/types";
import Box from "@mui/material/Box";
import EmailIframe from './EmailIframe';

interface MailDetailsProps {
  mail: Mail | null;
  cleanHtmlBody: string;
}

interface Props {
  cleanHtmlBody: string;
}

export const MailDetails: React.FC<MailDetailsProps> = ({
  mail,
  cleanHtmlBody,
}) => {
  if (!mail) {
    return (
      <Typography>
        Veuillez sélectionner un mail pour afficher son contenu.
      </Typography>
    );
  }

  return (
    <>
    <Box>
    <Typography
        component="span"
        sx={{ fontWeight: "bold", color: "#0077c2" }}
      >
        Expéditeur:
      </Typography>
      <Typography
        component="span"
        sx={{ fontWeight: "bold", color: "#273142", marginLeft: 1 }}
      >
        {mail.from}
      </Typography>
    </Box>

      <Typography variant="body1">
        Reçu le {new Date(parseInt(mail.internalDate, 10)).toLocaleString()}
      </Typography>
      <Box sx={{ marginTop: 1, marginBottom: 1 }}>
        <Typography
          component="span"
          sx={{ fontWeight: "bold", color: "#0077c2", marginRight: 1 }}
        >
          Objet:
        </Typography>
        <Typography
          component="span"
          sx={{
            fontWeight: "bold",
            color: "#273142",
            marginBottom: 1,
            marginTop: 1,
          }}
        >
          {mail.subject}
        </Typography>
      </Box>

      <Typography variant="body1" sx={{ fontWeight: "bold", color: "#0077c2", marginRight: 1, marginBottom: 1 }}>Corps du message :</Typography>
      {
        cleanHtmlBody ?
        <EmailIframe cleanHtmlBody={cleanHtmlBody} />
        :
        <Typography
        component="p"
        sx={{
          fontWeight: "bold",
          color: "red",
          marginBottom: 1,
          marginTop: 1,
          margin: "auto",
          fontStyle: "italic"
        }}
      >
        Le corps de ce mail n'a pas pu être analysé, le résultat sera moins fiable.
      </Typography>
      }
      
      {mail.attachments.length > 0 && (
        <>
          <Typography variant="body1">Pièces jointes :</Typography>
          <ul>
            {mail.attachments.map((attachment, index) => (
              <li key={index}>
                <Typography variant="body2">{attachment}</Typography>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
};

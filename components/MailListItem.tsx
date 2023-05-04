// components/MailListItem.tsx
import React from "react";
import {
  Button,
  Card,
  CardContent,
  Checkbox,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
} from "@mui/material";
import { Mail } from "../lib/database.types";

export interface MailListItemProps {
  mail: Mail;
  onMailClick: (mail: Mail) => void;
  onCheckboxToggle: (mail: Mail) => void;
  isSelected: boolean;
}

export const MailListItem: React.FC<MailListItemProps> = ({
  mail,
  onMailClick,
  onCheckboxToggle,
  isSelected,
}) => (
  <Card
    sx={{
      marginBottom: 1,
      boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.16)",
      borderRadius: "4px",
      opacity: 0.9,
    }}
  >
    <CardContent>
      <ListItem component={Button} onClick={() => onMailClick(mail)}>
        <ListItemIcon>
          <Checkbox
            edge="start"
            checked={isSelected}
            tabIndex={-1}
            disableRipple
            onClick={(event) => {
              event.stopPropagation();
              onCheckboxToggle(mail);
            }}
          />
        </ListItemIcon>
        <ListItemText
          primary={
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
            </>
          }
          secondary={new Date(parseInt(mail.internalDate, 10)).toLocaleString()}
          sx={{ marginLeft: "auto" }}
        />
      </ListItem>
    </CardContent>
  </Card>
);

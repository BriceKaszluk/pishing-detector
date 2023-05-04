import React, { useState, memo, useCallback, useEffect } from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import { Grid } from "@mui/material";
import { Mail } from "../lib/database.types";
import { MailListItem } from "./MailListItem";
import { MailDetails } from "./MailDetails";
import { PaginationControl } from "./PaginationControl";
import DOMPurify from "dompurify";

const ITEMS_PER_PAGE = 5;

interface MailListProps {
  userMails: Mail[];
}

export const MailList: React.FC<MailListProps> = memo(function MailList({
  userMails,
}) {
  const [selectedMails, setSelectedMails] = useState<Mail[]>([]);
  const [displayedMail, setDisplayedMail] = useState<Mail | null>(null);
  const [cleanHtmlBody, setCleanHtmlBody] = useState<string>("");
  const [phishingProbabilities, setPhishingProbabilities] = useState<number[]>([]);
  const [page, setPage] = useState(1);

  console.log(phishingProbabilities, "phishingProbabilities")
  console.log(selectedMails, "selectedMails")

  const handleCheckboxToggle = useCallback(
    (mail: Mail) => {
      const mailIndex = selectedMails.findIndex((m) => m.id === mail.id);
      if (mailIndex !== -1) {
        setSelectedMails((prevSelectedMails) => [
          ...prevSelectedMails.slice(0, mailIndex),
          ...prevSelectedMails.slice(mailIndex + 1),
        ]);
      } else {
        setSelectedMails((prevSelectedMails) => [...prevSelectedMails, mail]);
      }
    },
    [selectedMails, setSelectedMails]
  );

  const analyzeEmails = async () => {
    try {
      const response = await fetch("/api/phishing-analyse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emails: selectedMails }),
      });

      if (!response.ok) {
        throw new Error("Error analyzing emails");
      }

      const data = await response.json();
      setPhishingProbabilities(data.phishingProbabilities);
    } catch (error) {
      console.error("Failed to analyze emails:", error);
    }
  };
  
  const handleMailClick = useCallback(
    (mail: Mail) => {
      setDisplayedMail(mail);
    },
    [setDisplayedMail]
  );

  useEffect(() => {
    if (displayedMail && displayedMail.htmlBody) {
      const purifiedHtml = DOMPurify.sanitize(displayedMail.htmlBody);
      setCleanHtmlBody(purifiedHtml);
    } else {
      setCleanHtmlBody("");
    }
  }, [displayedMail]);

  const handlePageChange = useCallback(
    (event: React.ChangeEvent<unknown>, value: number) => {
      setPage(value);
    },
    [setPage]
  );

  const paginatedMails = userMails.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const handleLaunchAnalyse = () => {
    // Lancer l'analyse phishing sur les mails sélectionnés
  };

  return (
    <Box display="flex" sx={{ bgcolor: "info.main", p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Box sx={{ bgcolor: "primary.main", borderRadius: 4, p: 2 }}>
            <List>
              {paginatedMails.map((mail) => (
                <MailListItem
                  key={mail.id}
                  mail={mail}
                  isSelected={selectedMails.includes(mail)}
                  onMailClick={handleMailClick}
                  onCheckboxToggle={handleCheckboxToggle}
                />
              ))}
            </List>
            <PaginationControl
              totalPages={Math.ceil(userMails.length / ITEMS_PER_PAGE)}
              currentPage={page}
              onPageChange={handlePageChange}
              onButtonClick={analyzeEmails}
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box p={2} sx={{ color: "primary.main" }}>
            <MailDetails mail={displayedMail} cleanHtmlBody={cleanHtmlBody} />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
});

MailList.displayName = "MailList";

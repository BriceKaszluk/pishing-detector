import React, { useState, memo, useCallback, useEffect, useMemo } from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import { Grid } from '@mui/material';
import { Mail } from '../lib/types';
import { MailListItem } from './MailListItem';
import { MailDetails } from './MailDetails';
import { PaginationControl } from './PaginationControl';
import DOMPurify from 'dompurify';
import { useEmailsContext } from '../context/EmailsContext';

const ITEMS_PER_PAGE = 5;


const MailList: React.FC = memo(function MailList() {
  const [selectedMails, setSelectedMails] = useState<Mail[]>([]);
  const [displayedMail, setDisplayedMail] = useState<Mail | null>(null);
  const [cleanHtmlBody, setCleanHtmlBody] = useState<string>('');
  const [page, setPage] = useState(1);

  const { userMails, updateEmailsWithProbabilities } = useEmailsContext();

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
    [selectedMails, setSelectedMails],
  );

  const analyzeEmails = async () => {
    try {
      const response = await fetch('/api/phishingScore', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emails: selectedMails }),
      });

      if (!response.ok) {
        throw new Error('Error analyzing emails');
      }

      const data = await response.json();
      updateEmailsWithProbabilities(data);
    } catch (error) {
      console.error('Failed to analyze emails:', error);
    }
  };

  const handleMailClick = useCallback(
    (mail: Mail) => {
      setDisplayedMail(mail);
    },
    [setDisplayedMail],
  );

  useEffect(() => {
    if (displayedMail && displayedMail.htmlBody) {
      const purifiedHtml = DOMPurify.sanitize(displayedMail.htmlBody);
      setCleanHtmlBody(purifiedHtml);
    } else {
      setCleanHtmlBody('');
    }
  }, [displayedMail]);

  const handlePageChange = useCallback(
    (event: React.ChangeEvent<unknown>, value: number) => {
      setPage(value);
    },
    [setPage],
  );

  const paginatedMails = useMemo(() => {
    
    return userMails.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  }, [userMails, page]);

  return (
    <Box display="flex" sx={{ bgcolor: 'info.main', p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Box sx={{ bgcolor: 'primary.main', borderRadius: 4, p: 2 }}>
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
              page={page}
              onPageChange={handlePageChange}
              onButtonClick={analyzeEmails}
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box p={2} sx={{ color: 'primary.main' }}>
            <MailDetails mail={displayedMail} cleanHtmlBody={cleanHtmlBody} />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
});

MailList.displayName = 'MailList';

export default MailList;

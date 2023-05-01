import { useState } from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Pagination from '@mui/lab/Pagination';
import Typography from '@mui/material/Typography';

export interface Mail {
  id: string;
  threadId: string;
  snippet: string;
  internalDate: string;
  labelIds: string[];
}

interface MailListProps {
  userMails: Mail[];
}

const ITEMS_PER_PAGE = 20;

export const MailList: React.FC<MailListProps> = ({ userMails }) => {
  const [selectedMail, setSelectedMail] = useState<Mail | null>(null);
  const [page, setPage] = useState(1);

  const handleMailClick = (mail: Mail) => {
    setSelectedMail(mail);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const paginatedMails = userMails.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <Box display="flex">
      <Box width="50%">
        <List>
          {paginatedMails.map(mail => (
            <ListItem key={mail.id} button onClick={() => handleMailClick(mail)}>
              <ListItemText
                primary={mail.snippet}
                secondary={new Date(parseInt(mail.internalDate, 10)).toLocaleString()}
              />
            </ListItem>
          ))}
        </List>
        <Pagination count={Math.ceil(userMails.length / ITEMS_PER_PAGE)} page={page} onChange={handlePageChange} />
      </Box>
      <Box width="50%" p={2}>
        {selectedMail ? (
          <>
            <Typography variant="h5">{selectedMail.snippet}</Typography>
            <Typography variant="body1">
              Reçu le {new Date(parseInt(selectedMail.internalDate, 10)).toLocaleString()}
            </Typography>
          </>
        ) : (
          <Typography>Veuillez sélectionner un mail pour afficher son contenu.</Typography>
        )}
      </Box>
    </Box>
  );
};

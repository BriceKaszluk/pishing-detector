// components/MailListItem.tsx
import React from 'react';
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
  Grid,
} from '@mui/material';
import { Mail } from '../lib/types';
import Avatar from '@mui/material/Avatar';

export interface MailListItemProps {
  mail: Mail;
  onMailClick: (mail: Mail) => void;
  onCheckboxToggle: (mail: Mail) => void;
  isSelected: boolean;
}

const getChipBackground = (label: string) => {
  switch (label) {
    case 'danger':
      return "bg-danger";
    case 'warning':
      return "bg-warning";
    default:
      return "bg-safe";
  }
};


export const MailListItem: React.FC<MailListItemProps> = ({
  mail,
  onMailClick,
  onCheckboxToggle,
  isSelected,
}) => (
  <Card
    sx={{
      marginBottom: 1,
      boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.16)',
      borderRadius: '4px',
      opacity: 0.9,
    }}
  >
    <CardContent>
      <ListItem component={Button} onClick={() => onMailClick(mail)}>
        <Grid
          container
          flexDirection={{ xs: 'column', sm: 'row' }}
          alignItems={{ sm: 'center' }}
        >
          <Grid item xs={12} sm={10}>
            <ListItemText
              primary={
                <>
                  <Box>
                    <Typography
                      component="span"
                      sx={{ fontWeight: 'bold', color: '#0077c2' }}
                    >
                      Expéditeur:
                    </Typography>
                    <Typography
                      component="span"
                      sx={{
                        fontWeight: 'bold',
                        color: '#273142',
                        marginLeft: 1,
                        wordWrap: 'break-word',
                      }}
                    >
                      {mail.from}
                    </Typography>
                  </Box>

                  <Box sx={{ marginTop: 1, marginBottom: 1 }}>
                    <Typography
                      component="span"
                      sx={{
                        fontWeight: 'bold',
                        color: '#0077c2',
                        marginRight: 1,
                      }}
                    >
                      Objet:
                    </Typography>
                    <Typography
                      component="span"
                      sx={{
                        fontWeight: 'bold',
                        color: '#273142',
                        marginBottom: 1,
                        marginTop: 1,
                      }}
                    >
                      {mail.subject}
                    </Typography>
                  </Box>
                </>
              }
              secondary={new Date(
                parseInt(mail.internalDate, 10),
              ).toLocaleString()}
              sx={{ marginLeft: 'auto' }}
            />
          </Grid>
          <Grid item xs={12} sm={2} display="flex" justifyContent="flex-end">
            <ListItemIcon>
              {mail.phishingLabel ? (
                <Box sx={{ marginLeft: 1 }}>
                <Avatar
                  sx={{
                    fontWeight: 'bold',
                    width: 70,
                    height: 70,
                    overflow: 'hidden',
                    backgroundColor: 'transparent',
                  }}
                >
<div
  className={`${getChipBackground(
    mail.phishingLabel,
  )} w-full h-full bg-cover flex justify-center items-center`}
>
  <span
    className="bg-white rounded-full w-7 h-7 text-black flex justify-center items-center"
  >
    {mail.phishingScore !== undefined ? mail.phishingScore : 'N/A'}
  </span>
</div>



                </Avatar>
              </Box>
              ) : (
                <Checkbox
                  edge="start"
                  sx={{ '& .MuiSvgIcon-root': { fontSize: 40 } }}
                  checked={isSelected}
                  tabIndex={-1}
                  disableRipple
                  onClick={(event) => {
                    event.stopPropagation();
                    onCheckboxToggle(mail);
                  }}
                />
              )}
            </ListItemIcon>
          </Grid>
        </Grid>
      </ListItem>
    </CardContent>
  </Card>
);

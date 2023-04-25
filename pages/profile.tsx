import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Typography,
  Container,
  Box,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from "next/router";

const useStyles = makeStyles((theme) => ({
  profileContainer: {
    minHeight: 'calc(100vh - (64px + 260px))',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    padding: theme.spacing(4, 0),
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  deleteAccountButton: {
    marginTop: theme.spacing(3),
  },
}));

const Profile: React.FC = () => {
  const classes = useStyles();
  const user = useUser();
  const supabaseClient = useSupabaseClient();
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const router = useRouter();

  const handleClickOpen = () => {
    setOpenDeleteDialog(true);
  };

  const handleClose = () => {
    setOpenDeleteDialog(false);
  };

  const handleDeleteAccount = async () => {
    try {
      handleClose();
      const response = await fetch('/api/delete-account', {
        method: 'DELETE',
      });

      if (response.ok) {
        // Successfully deleted account
        await supabaseClient.auth.signOut();
        router.push('/signup');
      } else {
        // Error deleting account
        const { error } = await response.json();
        console.error('Error deleting account:', error);
      }
    } catch (error) {
      console.error('Error deleting account:', error.message);
    }
  };


  if (!user) {
    return <p>Veuillez vous connecter pour accéder à votre profil.</p>;
  }

  const { email } = user;
  const fullName = user.user_metadata?.full_name || 'N/A';

  return (
    <Container maxWidth="sm" className={`${classes.profileContainer} text-gray-800`}>
      <Typography component="h1" variant="h4">
        Profil de l'utilisateur
      </Typography>
      <Box className='mt-4 w-10/12'>
        <Paper className={`${classes.paper} mb-4`}>
          <Typography variant="h6">Nom :</Typography>
          <Typography>{fullName}</Typography>
        </Paper>
        <Paper className={classes.paper}>
          <Typography variant="h6">Adresse e-mail :</Typography>
          <Typography>{email}</Typography>
        </Paper>
      </Box>
      <Button
        className={classes.deleteAccountButton}
        variant="outlined"
        color="secondary"
        onClick={handleClickOpen}
      >
        Supprimer mon compte
      </Button>
      <Dialog
        open={openDeleteDialog}
        onClose={handleClose}
        aria-labelledby="delete-account-dialog-title"
        aria-describedby="delete-account-dialog-description"
      >
        <DialogTitle id="delete-account-dialog-title">Supprimer le compte</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-account-dialog-description">
            Êtes-vous sûr de vouloir supprimer définitivement votre compte ? Cette action est
            irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
          onClick={handleClose} color="primary">
          Annuler
        </Button>
        <Button onClick={handleDeleteAccount} color="secondary">
          Supprimer
        </Button>
      </DialogActions>
    </Dialog>
  </Container>
);
};

export default Profile;

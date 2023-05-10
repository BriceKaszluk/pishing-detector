import React from "react";
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
} from "@mui/material";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { GetServerSidePropsContext } from "next";
import { checkAuth } from '../services/checkAuth';

const Profil: React.FC = () => {
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
      const response = await fetch("/api/delete-account", {
        method: "DELETE",
      });

      if (response.ok) {
        // Successfully deleted account
        await supabaseClient.auth.signOut();
        router.push("/signup");
      } else {
        // Error deleting account
        const { error } = await response.json();
        if (error instanceof Error) {
          console.error("Error deleting account:", error.message);
        } else {
          console.error("Error deleting account:", error);
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error deleting account:", error.message);
      } else {
        console.error("Error deleting account:", error);
      }
    }
  };

  if (!user) {
    return <p>Veuillez vous connecter pour accéder à votre profil.</p>;
  }

  const { email } = user;
  const fullName = user.user_metadata?.full_name || "N/A";

  return (
    <Container
      maxWidth="sm"
      className="flex flex-col justify-center items-center text-center p-8"
    >
      <Typography component="h1" variant="h4" color="primary">
        Profil de l&apos;utilisateur
      </Typography>
      <Box className="mt-4 w-10/12 mx-auto">
        <Paper className="py-2 mb-4 text-center">
          <Typography variant="h6">Nom :</Typography>
          <Typography>{fullName}</Typography>
        </Paper>
        <Paper className="py-2 text-center">
          <Typography variant="h6">Adresse e-mail :</Typography>
          <Typography>{email}</Typography>
        </Paper>
      </Box>
      <Button
        sx={{ mt: 4 }}
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
        <DialogTitle id="delete-account-dialog-title">
          Supprimer le compte
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-account-dialog-description">
            Êtes-vous sûr de vouloir supprimer définitivement votre compte ?
            Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
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

export default Profil;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  try {
    const redirectResult = await checkAuth(ctx);

    if (redirectResult && typeof redirectResult === 'object') {
      return redirectResult;
    }

    return {
      props: {},
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    return {
      notFound: true,
    };
  }
};

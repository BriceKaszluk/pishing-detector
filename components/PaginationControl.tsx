import React, { useState } from 'react';
import { Pagination } from '@mui/material';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Loader from './Loader';
import { Mail } from '../lib/types';

interface PaginationControlProps {
  totalPages: number;
  page: number;
  onPageChange: (event: React.ChangeEvent<unknown>, value: number) => void;
  onButtonClick: () => Promise<void>;
  selectedMails: Mail[];
}

export const PaginationControl: React.FC<PaginationControlProps> = ({
  totalPages,
  page,
  onPageChange,
  onButtonClick,
  selectedMails,
}) => {
  const [loading, setLoading] = useState(false);

  const handleButtonClick = async () => {
    if(selectedMails.length > 0) {
      setLoading(true);
      await onButtonClick();
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Pagination
        count={totalPages}
        page={page}
        onChange={onPageChange}
        sx={{
          '& .MuiPaginationItem-page': {
            color: 'info.main',
            '&:hover': {
              backgroundColor: 'info.main',
              color: 'primary.dark',
            },
          },
          '& .MuiPaginationItem-icon': {
            color: 'info.main',
          },
          '& .MuiPaginationItem-ellipsis': {
            color: 'info.main',
          },
          '& .MuiPaginationItem-root.Mui-selected': {
            color: 'primary.main',
            backgroundColor: 'info.main',
          },
        }}
      />
      <Button
        variant="contained"
        onClick={handleButtonClick}
        style={{ width: '200px', padding: '0' }}
      >
        <div
          title={
            selectedMails.length === 0 ? 'Veuillez sélectionner au moins un mail' : ''
          }
          className={`bg-main hover:text-main hover:bg-success text-header w-full h-full py-2 rounded ${
            selectedMails.length === 0 ? 'cursor-not-allowed' : 'cursor-pointer'
          }`}
        >
          {loading ? (
            <Loader size={24} />
          ) : "Lancer l'analyse"}
        </div>
      </Button>
    </Box>
  );
};

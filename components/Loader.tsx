import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

interface LoaderProps {
  size?: number | string;
  thickness?: number;
  color?: 'primary' | 'secondary' | 'inherit';
}

const Loader: React.FC<LoaderProps> = ({ size = 40, thickness = 3.6 }) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="100%"
      height="100%"
      sx={{ background: "transparent" }}
    >
      <CircularProgress size={size} thickness={thickness} sx={{ color: 'primary.main' }} />
    </Box>
  );
};

export default Loader;

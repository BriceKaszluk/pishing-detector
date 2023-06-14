import React from 'react';
import { Typography, Grid } from '@mui/material';

interface SectionProps {
  title: string;
  explanation1: string;
  explanation2: string;
  videoSrc: string;
}

const Section: React.FC<SectionProps> = ({ title, explanation1, explanation2, videoSrc }) => {
  return (
    <Grid container className="md:min-h-screen mb-8 md:mb-0">
      <Grid item md={5} className="text-gray-800 flex flex-col justify-center mt-8 px-2 lg:px-40">
        <Typography variant="h5" className='capitalize mb-8 font-bold'>{title}</Typography>
        <Typography variant="body1" className='mb-4'>{explanation1}</Typography>
        <Typography variant="body1">{explanation2}</Typography>
      </Grid>
      <Grid item md={7} className="text-gray-800 flex justify-center items-center w-full mt-8 px-2">
        <video src={videoSrc} autoPlay muted loop className='rounded-lg border-2 shadow-lg'></video>
      </Grid>
    </Grid>
  );
};

export default Section;

import React from 'react';
import { Typography } from '@mui/material';

interface SectionProps {
  title: string;
  explanation1: string;
  explanation2: string;
  videoSrc: string;
}

const Section: React.FC<SectionProps> = ({ title, explanation1, explanation2, videoSrc }) => {
  return (
    <div className="md:min-h-screen mb-8 md:mb-0 flex md:flex-row flex-col">
      <div className="text-gray-800 flex flex-col justify-center mt-8 px-2 lg:px-40 md:w-5/12">
        <Typography variant="h5" sx={{ marginBottom: "32px" }} className='capitalize font-bold'>{title}</Typography>
        <Typography variant="body1" sx={{ marginBottom: "16px" }} >{explanation1}</Typography>
        <Typography variant="body1">{explanation2}</Typography>
      </div>
      <div className="text-gray-800 flex justify-center items-center w-full mt-8 px-2 md:w-7/12">
        <video src={videoSrc} autoPlay muted loop className='rounded-lg border-2 shadow-lg'></video>
      </div>
    </div>
  );
};

export default Section;

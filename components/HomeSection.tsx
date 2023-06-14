import React from 'react';
import { Typography } from '@mui/material';
import Image from 'next/image';

interface SectionProps {
  title: string;
  explanation1: string;
  explanation2: string;
  videoSrc: string;
}

const Section: React.FC<SectionProps> = ({
  title,
  explanation1,
  explanation2,
  videoSrc,
}) => {
  return (
    <div className="md:min-h-screen mb-8 md:mb-0 flex md:flex-row flex-col">
      <div className="relative text-gray-800 flex flex-col justify-center mt-8 px-2 lg:px-40 md:w-5/12">
        <div className='hidden md:block absolute w-full h-full z-0 bg-video_background bg-contain bg-no-repeat left-0 top-0 z-0 rounded-full'></div>
        <div className='realtive z-10 bg-white rounded-lg shadow p-6'>
        <Typography
          variant="h5"
          sx={{ marginBottom: '32px' }}
          className="capitalize font-bold"
        >
          {title}
        </Typography>
        <div className="flex items-start my-4">
          <div className="mr-3 mt-1">
            <Image
              src="/dot_fish.png"
              width={30}
              height={30}
              alt="Picture of a fish"
            />
          </div>
          <div className='w-9/12'>
            <Typography variant="body1" sx={{ marginBottom: '16px' }}>
              {explanation1}
            </Typography>
          </div>
        </div>
        <div className="flex items-start my-4">
        <div className="mr-3 mt-1">
            <Image
              src="/dot_fish.png"
              width={30}
              height={30}
              alt="Picture of a fish"
            />
          </div>
          <div className='w-9/12'>
            <Typography variant="body1">{explanation2}</Typography>
          </div>
        </div>
        </div>

      </div>
      <div className="text-gray-800 flex justify-center items-center w-full mt-8 px-2 md:w-7/12">
        <video
          src={videoSrc}
          autoPlay
          muted
          loop
          className="rounded-lg border-2 shadow-lg"
        ></video>
      </div>
    </div>
  );
};

export default Section;

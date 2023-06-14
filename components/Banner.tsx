import React from 'react';
import { Button, Typography } from '@mui/material';
import Link from 'next/link';

interface BannerProps {
  phrase: string;
  buttonText: string;
  buttonLink: string;
}

const Banner: React.FC<BannerProps> = () => {
  return (
    <div className="w-full text-black min-h-screen bg-cover bg-no-repeat bg-[50%] bg-wave_section">
      <section className="mb-32">
        <div className="min-h-screen bg-center flex flex-col justify-center items-center mt-8">
          <div className=" h-full w-full">
            <div className="flex h-full items-center justify-center">
              <div className="px-6 text-center md:px-12">
                <Typography
                  component="h1"
                  variant="h3"
                  className="mb-4 capitalize mb-8"
                >
                  Prenez le contrôle
                </Typography>
                <Typography
                  component="h1"
                  variant="h4"
                  className="mb-4 capitalize mb-8"
                >
                  ne laissez plus les emails suspects ruiner votre tranquillité
                  d&#39;esprit.
                </Typography>
                <Link href="/signup" passHref>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    className="text-xl text-white bg-button"
                  >
                    Vérifier mes mails en toute simplicité
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Banner;

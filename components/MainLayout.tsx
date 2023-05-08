import React, { useEffect, useState } from "react";
import Header from "./MainHeader";
import Footer from "./Footer";
import Loader from "./Loader"; // Importez le composant Loader
import { useRouter } from "next/router"; // Importez useRouter
import { useLoaderContext } from '../context/LoaderContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
  const { loading, setLoading } = useLoaderContext();

  useEffect(() => {
    const handleRouteChangeStart = () => {
      setLoading(true);
    };

    const handleRouteChangeComplete = () => {
      setTimeout(() => setLoading(false), 1000); // Ajoutez un délai de 1 seconde
    };

    const handleRouteChangeError = () => {
      setLoading(false);
    };

    router.events.on("routeChangeStart", handleRouteChangeStart);
    router.events.on("routeChangeComplete", handleRouteChangeComplete);
    router.events.on("routeChangeError", handleRouteChangeError);

    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart);
      router.events.off("routeChangeComplete", handleRouteChangeComplete);
      router.events.off("routeChangeError", handleRouteChangeError);
    };
  }, [router]);

  const isDashboardRoute = router.asPath.startsWith("/dashboard");

  return (
    <>
      <Header />
      <main className="bg-main min-h-main flex flex-col justify-center items-center">
       {loading && !isDashboardRoute ? (
        <Loader />
      ) : (
          children
      )}
      </main>
      <Footer />
    </>
  );
};

export default Layout;

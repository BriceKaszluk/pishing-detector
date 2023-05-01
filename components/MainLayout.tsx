import React from "react";
import Header from "./MainHeader";
import Footer from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Header />
      <main className="bg-main min-h-main flex flex-col justify-center items-center">{children}</main>
      <Footer />
    </>
  );
};



export default Layout;


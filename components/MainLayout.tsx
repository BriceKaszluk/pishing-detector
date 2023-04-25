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
      <main className="bg-main">{children}</main>
      <Footer />
    </>
  );
};

export default Layout;


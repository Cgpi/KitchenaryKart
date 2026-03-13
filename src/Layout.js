import React from "react";
import { Helmet } from "react-helmet-async";
import CustomHeader from "./header/Header1";
import Navbar from "./Navbar";
import Footer from "./Footer/Footer";
const Layout = ({ children, title, description, canonical }) => {
  return (
    <>
      <Helmet>
        <title>{title || "Kitchenary Kart — Premium Kitchen & HORECA Supplies"}</title>
        <meta
          name="description"
          content={
            description ||
            "Your one-stop destination for premium kitchen essentials and HORECA supplies. Shop deep fryers, cookware, serving equipment and more."
          }
        />
        <meta name="theme-color" content="#B91C1C" />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="canonical"
          href={canonical || "https://www.kitchenarykart.com/"}
        />
      </Helmet>

      <CustomHeader />
      <Navbar />

      <main className="min-h-screen">{children}</main>

      <Footer />
    </>
  );
};

export default Layout;

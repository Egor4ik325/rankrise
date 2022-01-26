import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const Layout = () => {
  return (
    <>
      {
        // Display global messages
      }
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};

export default Layout;

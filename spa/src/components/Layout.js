import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Messages from "./Messages";
import routes from "../routes";

const Layout = () => {
  const location = useLocation();

  return (
    <>
      <Messages />
      {location.pathname !== routes.login && <Header />}
      <Outlet />
      {location.pathname !== routes.login && <Footer />}
    </>
  );
};

export default Layout;

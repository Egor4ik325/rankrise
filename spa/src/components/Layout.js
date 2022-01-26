import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

import { useMessages } from "../hooks/MessagesContext";

const Layout = () => {
  const [messages, ,] = useMessages();

  return (
    <>
      {messages.map((message, i) => (
        <div key={i}>{message}</div>
      ))}
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};

export default Layout;

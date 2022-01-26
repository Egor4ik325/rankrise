import PropTypes from "prop-types";
import { useState, createContext, useContext } from "react";

const MessagesContext = createContext();

export const MessagesContextProvider = ({ children }) => {
  // Global message state for displaying messages (application-wide)
  const [messages, setMessages] = useState(["Hello, World", "How are you?"]);

  const value = [messages, setMessages];
  return (
    <MessagesContext.Provider value={value}>
      {children}
    </MessagesContext.Provider>
  );
};

MessagesContextProvider.propTypes = {
  children: PropTypes.node,
};

export const useMessages = () => useContext(MessagesContext);

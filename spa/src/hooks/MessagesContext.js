import PropTypes from "prop-types";
import { useState, createContext, useContext } from "react";

export class Message {
  // Text (string): Message text
  // Level (string): Message level one of "success", "error", "warning", "info"
  constructor(text, level = "info") {
    this.text = text;
    this.level = level;
  }
}

const MessagesContext = createContext();

export const MessagesContextProvider = ({ children }) => {
  // Global message state for displaying messages (application-wide)
  const [messages, setMessages] = useState([
    new Message("Hello, World.", "success"),
    new Message("How are you?", "error"),
    new Message(
      "Server may accidentally shut down, due to it's development hosting.",
      "warning"
    ),
    new Message("Good news!"),
  ]);

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

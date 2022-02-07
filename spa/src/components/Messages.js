import { Button } from "react-bootstrap";
import { useMessages } from "../hooks/MessagesContext";
import {
  faCheckCircle,
  faExclamationCircle,
  faTimesCircle,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const MessageIcon = ({ level }) => {
  return (
    <FontAwesomeIcon
      icon={
        level === "success"
          ? faCheckCircle
          : level === "warning"
          ? faExclamationCircle
          : level === "error"
          ? faTimesCircle
          : faInfoCircle
      }
    />
  );
};

const Messages = () => {
  const [messages, setMessages] = useMessages();

  const handleMessageDismiss = (i) => {
    setMessages(messages.filter((message, mi) => mi !== i));
  };

  return (
    <div className="messages">
      {messages.map((message, i) => (
        <div
          key={i}
          className={["message", `message-${message.level}`].join(" ")}
        >
          <div className="message-icon">
            {<MessageIcon level={message.level} />}
          </div>
          {message.text}
          <Button variant="close" onClick={() => handleMessageDismiss(i)} />
        </div>
      ))}
    </div>
  );
};

export default Messages;

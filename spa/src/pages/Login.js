import { useState } from "react";
import PropTypes from "prop-types";
import { Form, Button } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

import { useMessages } from "../hooks/MessagesContext";

import api from "../client";
import { LoginError } from "../client/errors";
import routes from "../routes";

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const location = useLocation();
  // Location to redirect to after login
  const to = location.state?.from?.pathname || routes.home;

  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [messages, setMessages] = useMessages();
  const [invalid, setInvalid] = useState(false);

  const handleUsernameChange = (e) => {
    e.preventDefault();
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    setPassword(e.target.value);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    // Try to login with provided credentials (result is either success or failed)
    try {
      // Access/refresh token will be automatically saved into local storage (and managed by API client)
      await api.authentication.login({ username, password });

      // Refetch the user (after logging-in)
      onLogin();

      setMessages([]);

      // Redirect to the home page
      navigate(to, { state: { from: location }, replace: true });
    } catch (error) {
      if (error instanceof LoginError) {
        // Display login failed message
        setMessages(
          messages.concat(["Unable to log in with provided credentials."])
        );
        setInvalid(true);

        return;
      }

      throw error;
    }
  };

  return (
    <div>
      <h3>Login</h3>

      <Form onSubmit={handleLoginSubmit}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Nezort11"
            onChange={handleUsernameChange}
            required
            isInvalid={invalid}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="••••••••"
            onChange={handlePasswordChange}
            required
            isInvalid={invalid}
          />
        </Form.Group>
        <Button variant="tertiary" type="submit">
          Login
        </Button>
      </Form>
    </div>
  );
};

Login.propTypes = {
  onLogin: PropTypes.func,
};

export default Login;

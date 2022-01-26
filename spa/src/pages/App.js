import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import Layout from "../components/Layout";
import Home from "./Home";
import Login from "./Login";
import NotFound from "./NotFound";

import { UserContextProvider } from "../hooks/UserContext";
// import { MessagesContextProvider } from "../hooks/MessagesContext";

import api from "../client";
import { NotAuthenticatedError } from "../client/errors";

// Utility hook for force updating component by changing arbitrary state
// const useForceUpdate = () => {
//   const [value, setValue] = useState(0);
//   return () => setValue(value + 1);
// };

// App == Router
const App = () => {
  // Manage user authentication state (should be available in all components => context)
  // (application-wide)
  const [user, setUser] = useState(undefined); // initially not determined

  const fetchUser = async () => {
    try {
      setUser(await api.authentication.getUser());
    } catch (error) {
      if (error instanceof NotAuthenticatedError) {
        setUser(null);
      }
    }
  };

  useEffect(() => {
    // Try to fetch user object otherwise set it to null
    // fetching will be perform on app startup (in constructor) by root component
    // and after login by child component
    fetchUser();
  }, []);

  return (
    <UserContextProvider value={[user, setUser]}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login onLogin={fetchUser} />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </UserContextProvider>
  );
};

export default App;

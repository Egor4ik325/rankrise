import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "../components/Layout";
import Home from "./Home";
import Login from "./Login";
import NotFound from "./NotFound";
import Search from "./Search";
import Question from "./Question";
import Product from "./Product";
import ProductAdd from "./ProductAdd";

import { UserContextProvider, useUserContext } from "../hooks/UserContext";
import { MessagesContextProvider } from "../hooks/MessagesContext";

import api from "../client";
import { NotAuthenticatedError } from "../client/errors";
import routes from "../routes";

// Utility hook for force updating component by changing arbitrary state
// const useForceUpdate = () => {
//   const [value, setValue] = useState(0);
//   return () => setValue(value + 1);
// };
const NotAuthenticatedOnly = ({ children }) => {
  const [user, setUser] = useUserContext();

  if (user) {
    return <Navigate to={routes.home} replace />;
  }

  return children;
};

const AuthenticatedRequired = ({ children }) => {
  const [user, setUser] = useUserContext();

  if (!user) {
    return <Navigate to={routes.login} replace />;
  }

  return children;
};

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
      <MessagesContextProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route
              path="login"
              element={
                <NotAuthenticatedOnly>
                  <Login onLogin={fetchUser} />
                </NotAuthenticatedOnly>
              }
            />
            <Route path="search" element={<Search />} />
            <Route path="questions/:id" element={<Question />} />
            <Route path="products/:id" element={<Product />} />
            <Route
              path="products/add"
              element={
                <AuthenticatedRequired>
                  <ProductAdd />
                </AuthenticatedRequired>
              }
            />
            <Route path="404" element={<NotFound />} />
            <Route path="*" element={<Navigate to={routes.notFound} />} />
          </Route>
        </Routes>
      </MessagesContextProvider>
    </UserContextProvider>
  );
};

export default App;

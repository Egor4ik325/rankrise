import { createContext, useContext } from "react";

const UserContext = createContext();

export const UserContextProvider = UserContext.Provider;
export const useUserContext = () => useContext(UserContext);

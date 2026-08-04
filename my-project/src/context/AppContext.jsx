import { useState, useContext, createContext, useEffect, useCallback } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

const AppContext = createContext();


export function AppContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadinguser, setloadinguser] = useState(true);
  const navigate = useNavigate();

 

  useEffect(() => {
    setloadinguser(false);
  },[] );

  const login = async (email, password) => {
    const { data } = await api.post("/api/auth/login", {
      email,
      password,
    });

    setUser(data.user);
  
  };

  const register = async (name, email, password) => {
  console.log("Register function called");
  console.log({ name, email, password });

  const { data } = await api.post("/api/auth/register", {
    name,
    email,
    password,
  });

  console.log("Response:", data);

  setUser(data.user);
  navigate("/");
};

  return (
    <AppContext.Provider value={{ user, loadinguser, login, register }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  return context;
}
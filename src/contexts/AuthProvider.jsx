import { createContext, useEffect, useState } from "react";
import { getProfile } from "../apis/authService";
import { Backdrop, CircularProgress } from "@mui/material";

export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken && !profile) {
      getProfile()
        .then((res) => {
          setProfile(res.data.data);
        })
        .catch((e) => {
          console.log(e);
          localStorage.removeItem("accessToken");
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [profile]);
  if (isLoading && !profile)
    return (
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={true}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );

  return (
    <AuthContext.Provider value={{ setProfile, profile }}>
      {children}
    </AuthContext.Provider>
  );
};

"use client";
import { createContext, useState, useContext } from "react";

type SessionType = any | null | undefined;

type AuthContextType = {
  session: SessionType;
  setSession: React.Dispatch<any>;
  userId: null | string;
  setUserId: React.Dispatch<React.SetStateAction<string | null>>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type ProviderProps = {
  children: any;
};

export const AuthContextProvider = ({ children }: ProviderProps) => {
  const [session, setSession] = useState<SessionType>(undefined);

  const [userId, setUserId] = useState<null | string>(null);

  return (
    <AuthContext.Provider
      value={{
        session,
        setSession,
        userId,
        setUserId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthContextProvider");
  }
  return ctx;
};

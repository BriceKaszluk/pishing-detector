import React, { createContext, useContext, useState } from "react";

interface LoaderContextProps {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const LoaderContext = createContext<LoaderContextProps>({
  loading: false,
  setLoading: () => {},
});

export const useLoaderContext = () => useContext(LoaderContext);

export const LoaderProvider: React.FC = ({ children }) => {
  const [loading, setLoading] = useState(false);

  return (
    <LoaderContext.Provider value={{ loading, setLoading }}>
      {children}
    </LoaderContext.Provider>
  );
};

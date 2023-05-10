import React, { createContext, useContext, useState } from "react";

interface LoaderContextProps {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const LoaderContext = createContext<LoaderContextProps>({
  loading: false,
  setLoading: () => {},
});

const useLoader = () => {
  const context = useContext(LoaderContext);
  if (!context) {
    throw new Error("useLoader must be used within a LoaderProvider");
  }
  return context;
};

export const useLoaderContext = useLoader;


export const LoaderProvider: React.FC = ({ children }) => {
  const [loading, setLoading] = useState(false);

  return (
    <LoaderContext.Provider value={{ loading, setLoading }}>
      {children}
    </LoaderContext.Provider>
  );
};

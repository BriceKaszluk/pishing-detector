import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSessionContext } from '@supabase/auth-helpers-react';

const AcceptedScopesContext = createContext<{
  hasAcceptedScope: boolean;
}>({
  hasAcceptedScope: false,
});

export const AcceptedScopesProvider: React.FC = ({ children }) => {
  const { session } = useSessionContext();
  const [hasAcceptedScope, setHasAcceptedScope] = useState(false);

  useEffect(() => {
    async function fetchScope() {
      if (session) {
        try {
          const response = await fetch(
            `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${session.provider_token}`,
          );
          const responseData = await response.json();
    
          const acceptedScopes = responseData.scope.split(' ');
          const requiredScope = 'https://www.googleapis.com/auth/gmail.readonly';
    
          setHasAcceptedScope(acceptedScopes.includes(requiredScope));
        } catch (error) {
          if (error instanceof Error) {
            console.error('Error:', error.message || error);
          } else {
            console.error('Error:', error);
          }
        }
      }
    }
    fetchScope();
  }, [session]);

  return (
    <AcceptedScopesContext.Provider value={{ hasAcceptedScope }}>
      {children}
    </AcceptedScopesContext.Provider>
  );
};

export const useAcceptedScopes = () => {
  return useContext(AcceptedScopesContext);
};

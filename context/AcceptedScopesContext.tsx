// AcceptedScopesContext.tsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSessionContext } from '@supabase/auth-helpers-react';

const AcceptedScopesContext = createContext<{
  acceptedScopeStatus: 'idle' | 'loading' | 'loaded';
  hasAcceptedScope: boolean;
}>({
  acceptedScopeStatus: 'idle',
  hasAcceptedScope: false,
});

export const AcceptedScopesProvider: React.FC = ({ children }) => {
  const { session } = useSessionContext();
  const [hasAcceptedScope, setHasAcceptedScope] = useState(false);
  const [acceptedScopeStatus, setAcceptedScopeStatus] = useState<'idle' | 'loading' | 'loaded'>('idle');

  useEffect(() => {
    async function fetchScope() {
      if (session && acceptedScopeStatus === 'idle') {
        setAcceptedScopeStatus('loading');
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
        } finally {
          setAcceptedScopeStatus('loaded');
        }
      }
    }
    fetchScope();
  }, [session, acceptedScopeStatus]);

  return (
    <AcceptedScopesContext.Provider value={{ acceptedScopeStatus, hasAcceptedScope }}>
      {children}
    </AcceptedScopesContext.Provider>
  );
};

export const useAcceptedScopes = () => {
  return useContext(AcceptedScopesContext);
};

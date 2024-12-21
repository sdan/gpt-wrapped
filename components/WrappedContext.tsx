import React, { createContext, useContext, useState } from 'react';

interface WrappedContextType {
  enhancedWrapped: boolean;
  setEnhancedWrapped: (value: boolean) => void;
}

const WrappedContext = createContext<WrappedContextType | undefined>(undefined);

export const WrappedProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [enhancedWrapped, setEnhancedWrapped] = useState(false);

  return (
    <WrappedContext.Provider value={{ enhancedWrapped, setEnhancedWrapped }}>
      {children}
    </WrappedContext.Provider>
  );
};

export const useWrappedContext = () => {
  const context = useContext(WrappedContext);
  if (!context) {
    throw new Error('useWrappedContext must be used within a WrappedProvider');
  }
  return context;
}; 
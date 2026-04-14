import React, { createContext, useState } from 'react';

export const UrgeContext = createContext();

export function UrgeProvider({ children }) {
  const [showUrge, setShowUrge] = useState(false);

  return (
    <UrgeContext.Provider value={{ showUrge, setShowUrge }}>
      {children}
    </UrgeContext.Provider>
  );
}

export function useUrgeModal() {
  const context = React.useContext(UrgeContext);
  if (!context) {
    throw new Error('useUrgeModal must be used within UrgeProvider');
  }
  return context;
}

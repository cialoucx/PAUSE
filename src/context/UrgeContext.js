import React, { createContext, useContext, useMemo, useState } from 'react';

export const UrgeContext = createContext();

export function UrgeProvider({ children }) {
  const [showUrge, setShowUrge] = useState(false);
  const value = useMemo(() => ({ setShowUrge, showUrge }), [showUrge]);

  return <UrgeContext.Provider value={value}>{children}</UrgeContext.Provider>;
}

export function useUrgeModal() {
  const context = useContext(UrgeContext);
  if (!context) {
    throw new Error('useUrgeModal must be used within UrgeProvider');
  }
  return context;
}

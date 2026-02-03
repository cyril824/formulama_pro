import React, { createContext, useContext, useState, useCallback } from 'react';

interface DocumentContextType {
  documentChanged: number; // Compteur pour détecter les changements
  notifyDocumentChange: () => void; // Fonction appelée après ajout/suppression
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

export const DocumentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [documentChanged, setDocumentChanged] = useState(0);

  const notifyDocumentChange = useCallback(() => {
    // Incrémenter le compteur pour signaler un changement
    setDocumentChanged(prev => prev + 1);
  }, []);

  return (
    <DocumentContext.Provider value={{ documentChanged, notifyDocumentChange }}>
      {children}
    </DocumentContext.Provider>
  );
};

export const useDocumentContext = () => {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error('useDocumentContext doit être utilisé dans DocumentProvider');
  }
  return context;
};

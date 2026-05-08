import React, { createContext, useContext, useState, ReactNode, FC, useRef, useCallback } from "react";

interface FooterContentItem {
  id: number;
  content: ReactNode;
}

interface FooterContextType {
  footerContents: FooterContentItem[];
  addFooterContent: (content: ReactNode) => number;
  removeFooterContent: (id: number) => void;
}

const FooterContext = createContext<FooterContextType | undefined>(undefined);

export const useFooterContent = () => {
  const context = useContext(FooterContext);
  if (context === undefined) {
    throw new Error("useFooterContent must be used within a FooterContentProvider");
  }
  return context;
};

interface FooterContentProviderProps {
  children: ReactNode;
}

export const FooterContentProvider: FC<FooterContentProviderProps> = ({ children }) => {
  const [footerContents, setFooterContents] = useState<FooterContentItem[]>([]);
  const nextIdRef = useRef(0);

  const addFooterContent = useCallback((content: ReactNode): number => {
    const id = nextIdRef.current++;
    setFooterContents(prev => [...prev, { id, content }]);
    return id;
  }, []);

  const removeFooterContent = useCallback((id: number) => {
    setFooterContents(prev => prev.filter(item => item.id !== id));
  }, []);

  return (
    <FooterContext.Provider value={{ footerContents, addFooterContent, removeFooterContent }}>
      {children}
    </FooterContext.Provider>
  );
};

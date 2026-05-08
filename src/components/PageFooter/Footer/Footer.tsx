import { FC, ReactNode, useEffect, useRef } from "react";
import { useFooterContent } from "../FooterContext/FooterContext";

interface FooterProps {
  children: ReactNode;
}

const Footer: FC<FooterProps> = ({ children }) => {
  const { addFooterContent, removeFooterContent } = useFooterContent();
  const idRef = useRef<number | null>(null);

  useEffect(() => {
    // Add content and store the ID
    idRef.current = addFooterContent(children);
    
    // Cleanup: remove content when component unmounts
    return () => {
      if (idRef.current !== null) {
        removeFooterContent(idRef.current);
      }
    };
  }, [children, addFooterContent, removeFooterContent]);

  // This component doesn't render anything directly
  // It only injects content into the footer via context
  return null;
};

export default Footer;

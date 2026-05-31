/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState, type ReactNode } from "react";

import { UIContext } from "./UiProvider";
import useIsMobile from "../hooks/useIsMobile";

type UiProviderProps = {
  children: ReactNode;
};

const UiProvider = ({ children }: UiProviderProps) => {
  const isMobile = useIsMobile();

  const [menuIsOpen, setMenuIsOpen] = useState<boolean>(!isMobile);

  useEffect(() => {
    setMenuIsOpen(!isMobile);
  }, [isMobile]);

  return (
    <UIContext.Provider value={{ menuIsOpen, setMenuIsOpen }}>
      {children}
    </UIContext.Provider>
  );
};

export default UiProvider;
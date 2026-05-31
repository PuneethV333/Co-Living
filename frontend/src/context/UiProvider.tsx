import React, { createContext } from "react";

type UiContextType = {
  menuIsOpen: boolean;
  setMenuIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const UIContext = createContext<UiContextType>({
  menuIsOpen: false,
  setMenuIsOpen: () => {},
});

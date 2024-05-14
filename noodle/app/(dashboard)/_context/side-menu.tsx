"use client";

import {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useState,
} from "react";

type SideMenuContextType = {
  isOpen: boolean;
  toggle: () => void;
};

const SideMenuContext = createContext<SideMenuContextType>({
  isOpen: false,
  toggle: () => {},
});

export const SideMenuProvider: FC<PropsWithChildren> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  return (
    <SideMenuContext.Provider value={{ isOpen, toggle }}>
      {children}
    </SideMenuContext.Provider>
  );
};

export const useSideMenu = () => useContext(SideMenuContext);

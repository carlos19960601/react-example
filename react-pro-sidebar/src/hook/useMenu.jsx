import { useContext } from "react";
import { MenuContext } from "../components/Menu";

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error("Menu Component is required!");
  }

  return context;
};

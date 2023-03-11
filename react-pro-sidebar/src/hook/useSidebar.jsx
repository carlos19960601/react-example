import { useContext } from "react";
import { SidebarContext } from "../components/SidebarContext";

export const useSidebar = () => {
  const context = useContext(SidebarContext);

  if (context === undefined) {
    throw new Error("ProSidebarProvider is required!");
  }

  return context;
};

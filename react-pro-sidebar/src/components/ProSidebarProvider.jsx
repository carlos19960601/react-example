import { SidebarProvider } from "./SidebarContext";

export const ProSidebarProvider = ({ children }) => {
  return <SidebarProvider>{children}</SidebarProvider>;
};

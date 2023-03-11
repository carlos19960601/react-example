import { createContext, useCallback, useMemo, useState } from "react";

export const SidebarContext = createContext(undefined);

export const SidebarProvider = ({ children }) => {
  const [sidebarState, setSidebarState] = useState();

  const updateSidebarState = useCallback((values) => {
    setSidebarState((prevState) => ({ ...prevState, ...values }));
  }, []);

  const updateCollapseState = useCallback(() => {
    setSidebarState((prevState) => ({
      ...prevState,
      collapsed: !Boolean(prevState?.collapsed),
    }));
  }, []);

  const updateToggleState = useCallback(() => {
    setSidebarState((prevState) => ({
      ...prevState,
      toggled: !Boolean(prevState?.toggled),
    }));
  }, []);

  const providerValue = useMemo(
    () => ({
      ...sidebarState,
      updateSidebarState,
      updateCollapseState,
      updateToggleState,
    }),
    [sidebarState, updateSidebarState, updateCollapseState, updateToggleState]
  );

  return (
    <SidebarContext.Provider value={providerValue}>
      {children}
    </SidebarContext.Provider>
  );
};

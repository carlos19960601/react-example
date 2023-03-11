import { useCallback } from "react";
import { useSidebar } from "./useSidebar";

export const useProSidebar = () => {
  const {
    updateSidebarState,
    updateCollapseState,
    updateToggleState,
    collapsed,
    rtl,
  } = useSidebar();

  const collapseSidebar = useCallback(
    (value) => {
      if (value === undefined) updateCollapseState();
      else updateSidebarState({ collapsed: value });
    },
    [updateCollapseState, updateSidebarState]
  );

  const toggleSidebar = useCallback(
    (value) => {
      if (value === undefined) updateToggleState();
      else updateSidebarState({ toggled: value });
    },
    [updateCollapseState, updateSidebarState]
  );

  return { rtl: !!rtl, collapsed: !!collapsed, collapseSidebar, toggleSidebar };
};

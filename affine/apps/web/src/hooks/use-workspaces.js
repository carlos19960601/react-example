import { useAtomValue } from "jotai";
import { workspacesAtom } from "../atoms";

export const useWorkspaces = () => {
  return useAtomValue(workspacesAtom);
};

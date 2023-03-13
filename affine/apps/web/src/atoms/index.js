import { assertExists } from "@blocksuite/store";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { WorkspacePlugins } from "../plugins";

export const jotaiWorkspacesAtom = atomWithStorage("jotai-workspaces", []);

export const workspacesAtom = atom(async (get) => {
  const flavours = Object.values(WorkspacePlugins).map(
    (plugin) => plugin.flavour
  );

  const jotaiWorkspaces = get(jotaiWorkspacesAtom).filter((workspace) =>
    flavours.includes(workspace.flavour)
  );

  const workspaces = await Promise.all(
    jotaiWorkspaces.map((workspace) => {
      const plugin = WorkspacePlugins[workspace.flavour];
      assertExists(plugin);
      const { CRUD } = plugin;
      return CRUD.get(workspace.id);
    })
  );

  return workspaces.filter((workspace) => workspace !== null);
});

import { DEFAULT_WORKSPACE_NAME } from "@affine/env";
import { assertExists, nanoid } from "@blocksuite/store";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { jotaiWorkspacesAtom } from "../atoms";
import { LocalPlugin } from "../plugins/local";
import { RemWorkspaceFlavour } from "../shared";
import { createEmptyBlockSuiteWorkspace } from "../utils";

export const useCreateFirstWorkspace = () => {
  const [jotaiWorkspaces, set] = useAtom(jotaiWorkspacesAtom);

  useEffect(() => {
    async function createFirst() {
      const blockSuiteWorkspace = createEmptyBlockSuiteWorkspace(
        nanoid(),
        () => undefined
      );

      blockSuiteWorkspace.meta.setName(DEFAULT_WORKSPACE_NAME);
      const id = await LocalPlugin.CRUD.create(blockSuiteWorkspace);
      const workspace = await LocalPlugin.CRUD.get(id);
      assertExists(workspace);

      set([{ id: workspace.id, flavour: RemWorkspaceFlavour.LOCAL }]);
    }

    if (
      jotaiWorkspaces.length === 0 &&
      localStorage.getItem("first") !== "true"
    ) {
      // localStorage.setItem("first", "true");
      createFirst();
    }
  }, [jotaiWorkspaces.length, set]);
};

import { useMemo } from "react";

export const RouteLogic = {
  REPLACE: "replace",
  PUSH: "push",
};

export const useRouterHelper = (router) => {
  return useMemo(
    () => ({
      jumpToPage: (workspaceId, pageId, logic = RouteLogic.PUSH) => {
        return router[logic]({
          pathname: `/workspace/[workspaceId]/[pageId]`,
          query: {
            workspaceId,
            pageId,
          },
        });
      },
      jumpToPublicWorkspacePage: (
        workspaceId,
        pageId,
        logic = RouteLogic.PUSH
      ) => {
        return router[logic]({
          pathname: `/public-workspace/[workspaceId]/[pageId]`,
          query: {
            workspaceId,
            pageId,
          },
        });
      },
      jumpToSubPath: (workspaceId, subPath, logic = RouteLogic.PUSH) => {
        return router[logic]({
          pathname: `/workspace/[workspaceId]/${subPath}`,
          query: {
            workspaceId,
          },
        });
      },
    }),
    [router]
  );
};

import { useRouter } from "next/router";
import { Suspense, useEffect } from "react";
import { PageLoading } from "../components/PageLoading";
import { useCreateFirstWorkspace } from "../hooks/use-create-first-workspace";
import { useRouterHelper } from "../hooks/use-Roouter-helper";
import { useWorkspaces } from "../hooks/use-workspaces";

const IndexPageInner = () => {
  const router = useRouter();
  const { jumpToPage, jumpToSubPage } = useRouterHelper();
  const workspaces = useWorkspaces();

  useEffect(() => {
    if (!router.isReady) {
      return;
    }
  }, []);

  return <PageLoading />;
};

const IndexPage = () => {
  useCreateFirstWorkspace();
  return (
    <Suspense>
      <IndexPageInner />
    </Suspense>
  );
};

export default IndexPage;

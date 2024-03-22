import { FC, PropsWithChildren } from "react";

interface Props {
  gradient?: boolean;
}

const DefaultLayout: FC<PropsWithChildren<Props>> = ({
  children,
  gradient = false,
}) => {
  return <div className="h-screen w-full overflow-hidden">{children}</div>;
};

export default DefaultLayout;

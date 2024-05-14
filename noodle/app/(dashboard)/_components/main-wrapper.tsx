import { FC, PropsWithChildren } from "react";

export const MainDashboardWrapper: FC<PropsWithChildren> = ({ children }) => {
  return <main>{children}</main>;
};

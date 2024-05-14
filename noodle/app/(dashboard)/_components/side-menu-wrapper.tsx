import { cn } from "@/utils/cn";
import { FC, PropsWithChildren } from "react";

export const SideMenuWrapper: FC<PropsWithChildren> = ({ children }) => {
  return (
    <aside className={cn("fixed left-0 h-screen w-[280px]")}>{children}</aside>
  );
};

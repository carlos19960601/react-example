"use client";

import { cn } from "@/utils/cn";
import { Button } from "@nextui-org/react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { FC, ReactNode } from "react";

type SideMenuLinkProps = {
  href: string;
  label: string;
  icon: ReactNode;
};

export const SideMenuLink: FC<SideMenuLinkProps> = ({ href, label, icon }) => {
  const pathname = usePathname();
  return (
    <li>
      <Button
        as={NextLink}
        href={href}
        startContent={icon}
        variant="light"
        size="md"
        className={cn(
          "w-full justify-start text-default-500 hover:text-default-900",
          pathname === href && "text-default-900"
        )}
      >
        {label}
      </Button>
    </li>
  );
};

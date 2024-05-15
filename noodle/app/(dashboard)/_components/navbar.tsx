"use client";

import { Button } from "@nextui-org/react";
import { PanelRightCloseIcon, PanelRightOpenIcon } from "lucide-react";
import { useSideMenu } from "../_context/side-menu";

export const Navbar = () => {
  const { isOpen, toggle } = useSideMenu();
  return (
    <nav>
      <Button
        isIconOnly
        onClick={toggle}
        size="sm"
        variant="light"
        radius="md"
        className="text-default-400 hover:text-default-900"
      >
        {isOpen ? (
          <PanelRightCloseIcon size={20} />
        ) : (
          <PanelRightOpenIcon size={20} />
        )}
      </Button>
    </nav>
  );
};

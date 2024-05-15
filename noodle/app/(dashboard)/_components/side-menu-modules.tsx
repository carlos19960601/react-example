"use client";

import { IconNames } from "@/components/icon";
import { ResizablePanel } from "@/components/resizable-panel";
import { ScrollArea } from "@/components/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";
import { useState } from "react";

const CreateModulePopover = () => {
  const [step, setStep] = useState(0);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [icon, setIcon] = useState<IconNames>("GraduationCap");

  return (
    <Popover isOpen={popoverOpen}>
      <PopoverTrigger></PopoverTrigger>
      <PopoverContent>
        <ResizablePanel>
          <form></form>
        </ResizablePanel>
      </PopoverContent>
    </Popover>
  );
};

export function SideMenuModules() {
  return (
    <section>
      <div className="flex items-center justify-between px-4">
        <h3 className="text-sm text-default-400">Modules</h3>
      </div>
      <ScrollArea></ScrollArea>
    </section>
  );
}

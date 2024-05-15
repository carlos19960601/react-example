import { dashboardLinks } from "@/app/config";
import { Brand } from "@/components/brand";
import { SideMenuLink } from "./side-menu-link";
import { SideMenuModules } from "./side-menu-modules";
import { SideMenuWrapper } from "./side-menu-wrapper";

export const DashboardSideMenu = () => {
  return (
    <SideMenuWrapper>
      <div className="flex flex-1 flex-col gap-8 overflow-hidden pb-6">
        <div className="pl-4">
          <Brand size={36} />
        </div>
        <section className="pr-6">
          <ul>
            {dashboardLinks.map((link) => (
              <SideMenuLink key={link.label} {...link} />
            ))}
          </ul>
        </section>
        <SideMenuModules />
      </div>
    </SideMenuWrapper>
  );
};

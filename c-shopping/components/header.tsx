import { LogoH, Sidebar } from "@/components";
import Link from "next/link";

export default function Header() {
  return (
    <>
      <header>
        <div>
          <div className="flex items-center justify-between border-b">
            <Link passHref href="/">
              <LogoH className="w-40 h-14" />
            </Link>
            <Sidebar />
          </div>
          <div>
            <Search />
            <div>
              <Signup />
              <Cart />
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

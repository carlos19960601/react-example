import Image from "next/image";
import { PropsWithChildren } from "react";

const Header = ({ children }: PropsWithChildren) => {
  return <div className="container mx-auto w-full px-10 py-6">
    <div className="flex w-full justify-between">
      <a href="/" className="flex items-center font-bold text-2xl text-primary lg:text-4xl">
        <Image src="/logo.svg" className="mr-3" width={64} height={64} alt="Qwerty Learner Logo" />
        <h1>Qwerty Learner</h1>
      </a>
      <nav className="flex items-center rounded-xl bg-white space-x-3 shadow-2xl shadow-indigo-100 p-4">
        {children}
      </nav>
    </div>
  </div>
}

export default Header;
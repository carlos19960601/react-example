import { Logo } from "../components/logo";

export function HomePage() {
  return (
    <div className="fixed bg-white flex flex-col gap-4">
      <div>
        <Logo size={32} />
      </div>
      <div className="">
        <div className="font-bold text-center max-w-[680px] sm:text-sm md:text-md lg:text-lg">
          A structured note-taking app for personal use
        </div>
      </div>
    </div>
  );
}

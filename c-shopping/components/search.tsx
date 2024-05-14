import Icons from "./common/icons";

export default function Search() {
  return (
    <div className="flex flex-row flex-grow max-w-3xl">
      <div className="flex flex-row flex-grow rounded-md bg-zinc-200/80">
        <button className="flex-grow py-1 px-3 text-left bg-transparent outline-none cursor-pointer text-gray-400 focus:border-none">
          善假于物，用好搜索...
        </button>
        <button className="p-2">
          <Icons.Search className="icon text-gray-400" />
        </button>
      </div>
    </div>
  );
}

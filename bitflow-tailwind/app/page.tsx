import { Flow } from "@/components/flow";
import { simpleAnswerSplit } from "@/flows/simpleAnswerSplit";

export default function Home() {
  return (
    <div>
      <div className="h-[400px]">
        <Flow autoFitView {...simpleAnswerSplit} />
      </div>
      <div className="max-w-screen-lg mx-auto">empty</div>
    </div>
  );
}

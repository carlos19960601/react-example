import { TranscriberData } from "@/hooks/useTranscriber";
import { formatAudioTimestamp } from "@/utils/AudioUtils";
import { Button } from "@nextui-org/react";

interface Props {
  transcribedData: TranscriberData | undefined;
}

const Transcript = ({ transcribedData }: Props) => {
  console.log(transcribedData);
  return (
    <div className="w-full flex flex-col my-2 p-4 max-h-[20rem] overflow-y-auto">
      {transcribedData?.chunks &&
        transcribedData.chunks.map((chunk, i) => (
          <div
            key={`${i}-${chunk.text}`}
            className="w-full flex flex-row mb-2 bg-white rounded-lg p-4 shadow-xl shadow-black/5 ring-1 ring-slate-700/10"
          >
            <div className="mr-5">
              {formatAudioTimestamp(chunk.timestamp[0])}
            </div>
            {chunk.text}
          </div>
        ))}
      {transcribedData && !transcribedData.isBusy && (
        <div>
          <Button>Export TXT</Button>
          <Button>Export JSON</Button>
        </div>
      )}
    </div>
  );
};

export default Transcript;

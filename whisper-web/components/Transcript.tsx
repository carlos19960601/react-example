import { TranscriberData } from "@/hooks/useTranscriber";
import { Button } from "@nextui-org/react";

interface Props {
  transcribedData: TranscriberData | undefined;
}

const Transcript = ({ transcribedData }: Props) => {
  return (
    <div>
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

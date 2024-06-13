import { Button } from "@nextui-org/react";
import { ButtonHTMLAttributes } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  isModelLoading: boolean;
  isTranscribing: boolean;
}

const TranscribeButton = (props: Props) => {
  const { isModelLoading, isTranscribing, onClick, ...buttonProps } = props;
  return (
    <Button
      isLoading={isModelLoading || isTranscribing}
      disabled={isTranscribing}
      onClick={(event) => {
        if (onClick && !isTranscribing && !isModelLoading) {
          onClick(event);
        }
      }}
    >
      Transcribe Audio
    </Button>
  );
};

export default TranscribeButton;

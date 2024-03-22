import { IconLogo } from "@penx/icons";

interface Props {
  size?: number;
  to?: string;
  showText?: boolean;
  stroke?: number | string;
}

export const Logo = ({
  showText = true,
  to,
  size = 32,
  stroke = 2,
  ...rest
}: Props) => {
  const content = (
    <>
      <IconLogo size={size * 0.9} />
      {showText && (
        <div>
          <div className="font-bold text-[32px] flex">
            <div>Pen</div>
            <div className=" text-[#6B37FF]">X</div>
          </div>
        </div>
      )}
    </>
  );
  return <div className="flex">{content}</div>;
};

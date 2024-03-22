import clsx from "clsx";
import { useTranslations } from "next-intl";

interface Props extends Omit<React.HTMLAttributes<any>, "children"> {}
const Tool = (props: Props) => {
  const { className } = props;

  const t = useTranslations("Tool");
  return (
    <div
      className={clsx(
        "flex flex-col justify-between pb-4 relative overflow-hidden bg-black border-l-[1px]",
        className
      )}
    >
      <div className="top">
        <div className="import">
          <div className="btn relative justify-center">{t("openVideo")}</div>
          <div className="btn ">{t("openSub")}</div>
        </div>
      </div>
    </div>
  );
};

export default Tool;

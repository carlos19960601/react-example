import { CSSProperties, FC } from "react";

export type FlowNodeProps = {
  tone?:
    | "red"
    | "yellow"
    | "pink"
    | "purple"
    | "mint"
    | "teal"
    | "blue"
    | "grey"
    | "green"
    | "portalOrange"
    | "amber"
    | "portalBlue";
  title: string;
};

export const FlowNode: FC<FlowNodeProps> = ({ tone = "grey", title }) => {
  let primaryTextColor: CSSProperties["color"];
  let secondaryTextColor: CSSProperties["color"];
  let primaryBackgroundColor: CSSProperties["backgroundColor"];
  let secondaryBackgroundColor: CSSProperties["backgroundColor"];

  switch (tone) {
    case "blue": {
      primaryTextColor = "#003e6b";
      secondaryTextColor = "#0f609b";
      primaryBackgroundColor = "#dceefb";
      secondaryBackgroundColor = "#b6e0fe";
      break;
    }
    case "mint": {
      primaryTextColor = "#3d663d";
      secondaryTextColor = "#7acc7a";
      primaryBackgroundColor = "#eaffea";
      secondaryBackgroundColor = "#d6ffd6";
      break;
    }
    case "teal": {
      primaryTextColor = "#014d40";
      secondaryTextColor = "#147d64";
      primaryBackgroundColor = "#effcf6";
      secondaryBackgroundColor = "#c6f7e2";
      break;
    }
    case "green": {
      primaryTextColor = "#14532d";
      secondaryTextColor = "#15803d";
      primaryBackgroundColor = "#f0fdf4";
      secondaryBackgroundColor = "#dcfce7";
      break;
    }
    case "pink": {
      primaryTextColor = "#620042";
      secondaryTextColor = "#a30664";
      primaryBackgroundColor = "#ffe3ec";
      secondaryBackgroundColor = "#ffb8d2";
      break;
    }
    case "purple": {
      primaryTextColor = "#240754";
      secondaryTextColor = "#421987";
      primaryBackgroundColor = "#eae2f8";
      secondaryBackgroundColor = "#cfbcf2";
      break;
    }
    case "red": {
      primaryTextColor = "#610404";
      secondaryTextColor = "#911111";
      primaryBackgroundColor = "#ffeeee";
      secondaryBackgroundColor = "#facdcd";
      break;
    }
    case "yellow": {
      primaryTextColor = "#513c06";
      secondaryTextColor = "#a27c1a";
      primaryBackgroundColor = "#fffaeb";
      secondaryBackgroundColor = "#fcefc7";
      break;
    }
    case "amber": {
      primaryTextColor = "#78350f";
      secondaryTextColor = "#d97706";
      primaryBackgroundColor = "#fffbeb";
      secondaryBackgroundColor = "#fef3c7";
      break;
    }
    case "grey": {
      primaryTextColor = "#1f2933";
      secondaryTextColor = "#3e4c59";
      primaryBackgroundColor = "#f5f7fa";
      secondaryBackgroundColor = "#e4e7eb";
      break;
    }
    case "portalBlue": {
      primaryTextColor = "#034ABD";
      secondaryTextColor = "#045EE0";
      primaryBackgroundColor = "#E6FCFF";
      secondaryBackgroundColor = "#CEF9FF";
      break;
    }
    case "portalOrange": {
      primaryTextColor = "#B15608";
      secondaryTextColor = "#E97008";
      primaryBackgroundColor = "#FFF9E6";
      secondaryBackgroundColor = "#FFF4CD";
      break;
    }
  }

  return (
    <div
      className="max-w-[300px] shadow rounded border border-solid relative p-1 nowheel"
      style={{
        color: primaryTextColor,
        borderColor: primaryTextColor,
        backgroundColor: primaryBackgroundColor,
      }}
    >
      <p>{title}</p>
    </div>
  );
};

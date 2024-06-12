"use client";
import { ReactNode, useState } from "react";

const AudioManager = () => {
  return (
    <>
      <div>
        <div>
          <UrlTile icon={<AnchorIcon />} text={"From URL"} />
        </div>
      </div>
    </>
  );
};

export default AudioManager;

const UrlTile = (props: { icon: ReactNode; text: string }) => {
  const [showModal, setShowModal] = useState(false);

  const onClick = () => {
    setShowModal(true);
  };

  return (
    <>
      <Tile icon={props.icon} text={props.text} onClick={onClick} />
    </>
  );
};

const Tile = (props: {
  icon: ReactNode;
  text: string;
  onClick?: () => void;
}) => {
  return (
    <button
      onClick={props.onClick}
      className="flex items-center justify-center rounded-lg p-2 text-slate-500 hover:text-indigo-600 transition-all duration-200"
    >
      <div className="w-7 h-7">{props.icon}</div>
      {props.text && (
        <div className="ml-2 break-all text-base w-30">{props.text}</div>
      )}
    </button>
  );
};

function AnchorIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
      />
    </svg>
  );
}

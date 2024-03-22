import { FC, forwardRef } from "react";

export interface IconProps {
  fill?: "none" | "currentColor" | (string & {});

  strokeWidth?: number | string;

  size?: number;
}

export interface IconifyOptions {
  /**
   * The icon `svg` viewBox
   * @default "0 0 24 24"
   */
  viewBox?: string;

  /**
   * The `svg` path or group element
   * @type React.ReactElement | React.ReactElement[]
   */
  path?: React.ReactElement | React.ReactElement[];

  /**
   * If the has a single path, simply copy the path's `d` attribute
   */
  d?: string;

  displayName?: string;

  fill?: "none" | "currentColor";

  pathProps?: {
    strokeLinecap?: "butt" | "round" | "square" | "inherit";
    strokeLinejoin?: "miter" | "round" | "bevel" | "inherit";
    strokeWidth?: number | string;
    fillRule?: "nonzero" | "evenodd" | "inherit";
    fill?: string;
    clipRule?: number | string;
  };
}

export function iconify(options: IconifyOptions) {
  const { viewBox, path, d, displayName, pathProps = {} } = options;
  const Comp = forwardRef<SVGSVGElement, IconProps>((props, ref) => {
    const size = 24;
    return (
      <svg
        ref={ref}
        viewBox={viewBox ?? `0 0 ${size} ${size}`}
        square={props.size || 24}
        xmlns="http://www.w3.org/2000/svg"
        {...(props as any)}
      >
        {path ?? (
          <path fillRule="evenodd" clipRule="evenodd" d={d} {...pathProps} />
        )}
      </svg>
    );
  });

  if (displayName) Comp.displayName = displayName;

  return Comp;
}

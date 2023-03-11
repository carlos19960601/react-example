import cs from "classnames";
import { forwardRef } from "react";

export const menuButtonStyles = (props) => {
  const { rtl, level, collapsed, disabled, active } = props;
  return `
    display: flex;
    align-items: center;
    height: 50px;
    color:inherit;
    cursor: pointer;
    box-sizing: border-box;
    &:hover {
      background-color: #f3f3f3;
    };
    ${
      rtl
        ? `padding-left: 20px;
        padding-right: ${
          level === 0 ? 20 : (collapsed ? level : level + 1) * 20
        }px;`
        : `padding-right: 20px;
    padding-left: ${level === 0 ? 20 : collapsed ? level : level + 1}px;
        `
    }

    ${
      disabled &&
      ` 
      pointer-events: none;
      cursor: default;
      color:#adadad;
        `
    }

    ${active && "background-color: #e2eef9;"}
  `;
};

const MenuButtonRef = ({ children, className, ...rest }, ref) => {
  return (
    <a ref={ref} className={cs(className)} {...rest}>
      {children}
    </a>
  );
};

export const MenuButton = forwardRef(MenuButtonRef);

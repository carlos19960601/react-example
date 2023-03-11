import { forwardRef } from "react";
import styled from "styled-components";
import { useMenu } from "../hook/useMenu";
import { MenuButton } from "./MenuButton";

const StyledMenuItem = styled.li``;

export const StyledMenuLabel = styled.span`
  flex-grow: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  ${({ rootStyles }) => rootStyles};
`;

const MenuItemFR = (
  { children, level = 0, disabled = false, active = false },
  ref
) => {
  const { menuItemStyles } = useMenu();
  const getMenuItemStyles = (element) => {
    if (menuItemStyles) {
      const params = { level, disabled, active, isSubmenu: false };
      const {
        root: rootElStyles,
        button: buttonElStyles,
        label: labelElStyles,
        icon: iconElStyles,
        prefix: prefixElStyles,
        suffix: suffixElStyles,
      } = menuItemStyles;

      switch (element) {
        case "root":
          return typeof rootElStyles === "function"
            ? rootElStyles(params)
            : rootElStyles;

        case "button":
          return typeof buttonElStyles === "function"
            ? buttonElStyles(params)
            : buttonElStyles;

        case "label":
          return typeof labelElStyles === "function"
            ? labelElStyles(params)
            : labelElStyles;

        case "icon":
          return typeof iconElStyles === "function"
            ? iconElStyles(params)
            : iconElStyles;

        case "prefix":
          return typeof prefixElStyles === "function"
            ? prefixElStyles(params)
            : prefixElStyles;

        case "suffix":
          return typeof suffixElStyles === "function"
            ? suffixElStyles(params)
            : suffixElStyles;

        default:
          return undefined;
      }
    }
  };
  return (
    <StyledMenuItem ref={ref}>
      <MenuButton>
        <StyledMenuLabel rootStyles={getMenuItemStyles("label")}>
          {children}
        </StyledMenuLabel>
      </MenuButton>
    </StyledMenuItem>
  );
};

export const MenuItem = forwardRef(MenuItemFR);

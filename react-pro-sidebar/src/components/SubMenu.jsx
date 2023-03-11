import cs from "classnames";
import React, { forwardRef, useRef, useState } from "react";
import styled from "styled-components";
import { useMenu } from "../hook/useMenu";
import { useSidebar } from "../hook/useSidebar";
import { MenuButton, menuButtonStyles } from "./MenuButton";
import { SubMenuContent } from "./SubMenuContent";

const StyledSubMenu = styled.li`
  position: relative;
  width: 100%;
  ${(props) => props.menuItemStyles}
  ${(props) => props.rootStyles}
  > .ps-menu-button {
    ${({ level, disabled, active, collapsed, rtl }) =>
      menuButtonStyles({ level, disabled, active, collapsed, rtl })}

    ${({ buttonStyles }) => buttonStyles};
  }
`;

const StyledMenuIcon = styled.span`
  width: 35px;
  min-width: 35px;
  height: 35px;
  line-height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  ${({ rootStyles }) => rootStyles};
`;

const StyledMenuLable = styled.span`
  overflow: hidden;
`;

const StyledExpandIconWrapper = styled.span`
  ${({ collapsed, level, rtl }) =>
    collapsed &&
    level === 0 &&
    `
    position: absolute;
    ${rtl ? "left: 10px;" : "right: 10px;"}
    top:50%;
    transform: translateY(-50%);
  `}
  ${({ rootStyles }) => rootStyles};
`;

const SubMenuFR = (
  {
    children,
    label,
    icon,
    className,
    active = false,
    disabled = false,
    level = 0,
    open: openSubmenu,
    defaultOpen,
    rootStyles,
    onClick,
    onOpenChange,
  },
  ref
) => {
  const { collapsed, transitionDuration, rtl } = useSidebar();
  const { menuItemStyles } = useMenu();

  const [open, setOpen] = useState(!!defaultOpen);
  const contentRef = useRef(null);

  const childNodes = React.Children.toArray(children).filter(Boolean);

  const sharedClasses = {
    "ps-active": active,
    "ps-disabled": disabled,
    "ps-open": openSubmenu ?? open,
  };

  const handleSlideToggle = () => {
    if (typeof openSubmenu === "undefined" && !(level === 0 && collapsed)) {
      onOpenChange?.(!open);
      setOpen(!open);
    } else {
      onOpenChange?.(!openSubmenu);
    }
  };

  const handleOnClick = (event) => {
    onClick?.(event);
    handleSlideToggle();
  };

  const getSubMenuItemStyles = (element) => {
    if (menuItemStyles) {
      const {
        root: rootElStyles,
        button: buttonElStyles,
        label: labelElStyles,
        icon: iconElStyles,
        prefix: prefixElStyles,
        suffix: suffixElStyles,
        subMenuContent: subMenuContentElStyles,
        SubMenuExpandIcon: SubMenuExpandIconElStyles,
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

        case "SubMenuExpandIcon":
          return typeof SubMenuExpandIconElStyles === "function"
            ? SubMenuExpandIconElStyles(params)
            : SubMenuExpandIconElStyles;

        case "subMenuContent":
          return typeof subMenuContentElStyles === "function"
            ? subMenuContentElStyles(params)
            : subMenuContentElStyles;

        default:
          return undefined;
      }
    }
  };

  return (
    <StyledSubMenu
      ref={ref}
      className={cs(
        "ps-menuitem-root",
        "ps-submenu-root",
        sharedClasses,
        className
      )}
      level={level}
      collapsed={collapsed}
      menuItemStyles={getSubMenuItemStyles("root")}
      buttonStyles={getSubMenuItemStyles("button")}
      rootStyles={rootStyles}
      disabled={disabled}
      active={active}
      rtl={rtl}
    >
      <MenuButton
        className={cs("ps-menu-button", sharedClasses)}
        onClick={handleOnClick}
      >
        {icon && (
          <StyledMenuIcon
            className={cs("ps-menu-icon", sharedClasses)}
            rootStyles={getSubMenuItemStyles("icon")}
          >
            {icon}
          </StyledMenuIcon>
        )}
        <StyledMenuLable className={cs("ps-menu-label", sharedClasses)}>
          {label}
        </StyledMenuLable>
        <StyledExpandIconWrapper
          rtl={rtl}
          className={cs("ps-submenu-expand-icon", sharedClasses)}
          collapsed={collapsed}
          level={level}
          rootStyles={getSubMenuItemStyles("SubMenuExpandIcon")}
        ></StyledExpandIconWrapper>
      </MenuButton>
      <SubMenuContent ref={contentRef} open={openSubmenu ?? open}>
        {childNodes.map((node) =>
          React.cloneElement(node, { ...node.props, level: level + 1 })
        )}
      </SubMenuContent>
    </StyledSubMenu>
  );
};

export const SubMenu = forwardRef(SubMenuFR);

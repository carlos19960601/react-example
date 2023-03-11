import cs from "classnames";
import { createContext, forwardRef, useMemo } from "react";
import styled from "styled-components";

export const MenuContext = createContext(undefined);

const StyledMenu = styled.nav`
  &.ps-menu-root {
    ${(props) => props.rootStyles}
  }
`;

const StyledUl = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const MenuFR = (
  {
    children,
    className,
    transitionDuration = 300,
    closeOnClick = false,
    menuItemStyles,
    rootStyles,
    renderExpandIcon,
    ...rest
  },
  ref
) => {
  const providerValue = useMemo(
    () => ({
      transitionDuration,
      closeOnClick,
      menuItemStyles,
      renderExpandIcon,
    }),
    [transitionDuration, closeOnClick, menuItemStyles, renderExpandIcon]
  );

  return (
    <MenuContext.Provider value={providerValue}>
      <StyledMenu
        ref={ref}
        className={cs("ps-menu-root", className)}
        rootStyles={rootStyles}
        {...rest}
      >
        <StyledUl>{children}</StyledUl>
      </StyledMenu>
    </MenuContext.Provider>
  );
};

export const Menu = forwardRef(MenuFR);

import { forwardRef } from "react";
import styled from "styled-components";

const StyledSidebar = styled.aside`
  width: ${(props) => props.width};
`;

const StyledSidebarContainer = styled.div`
  position: relative;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 3;
`;

const SidebarFR = (
  { children, width = "250px", backgroundColor = "rgb(249, 249, 249, 0.7)" },
  ref
) => {
  return (
    <StyledSidebar ref={ref} width={width}>
      <StyledSidebarContainer>{children}</StyledSidebarContainer>
    </StyledSidebar>
  );
};

export const Sidebar = forwardRef(SidebarFR);

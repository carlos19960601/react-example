import styled, { css } from "styled-components";
import { useProSidebar } from "./hook/useProSidebar";
import { Typography } from "./Typography";

const StyledSidebarHeader = styled.div`
  height: 64px;
  min-height: 64px;
  display: flex;
  align-items: center;
  padding: 0 20px;
`;

const StyledLogo = styled.div`
  width: 35px;
  min-width: 35px;
  height: 35px;
  min-height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-size: 24px;
  color: white;
  font-weight: 700;
  background-color: #009fdb;
  background: linear-gradient(45deg, rgb(21 87 205) 0%, rgb(90 225 255) 100%);

  ${(props) =>
    props.rtl
      ? css`
          margin-left: 10px;
          margin-right: 4px;
        `
      : css`
          margin-right: 10px;
          margin-left: 4px;
        `}
`;

export const SidebarHeader = ({ children, ...rest }) => {
  const { rtl } = useProSidebar();

  return (
    <StyledSidebarHeader {...rest}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <StyledLogo rtl={rtl}>P</StyledLogo>
        <Typography variant="subtitle1" fontWeight={700} color="#0098e5">
          Pro Siderbar
        </Typography>
      </div>
    </StyledSidebarHeader>
  );
};

import styled, { css } from "styled-components";

const StyledTypography = styled.p`
  margin: 0;

  font-weight: ${(props) => props.fontWeight || ""};
  color: ${(props) => props.color || ""};
  font-size: ${(props) => props.fontSize || ""};
  ${({ variant }) => {
    switch (variant) {
      case "h1":
        return css`
          background-color: black;
          color: white;
        `;
      case "h2":
        return css`
          font-size: 60px;
          line-height: 72px;
        `;
      case "h3":
        return css`
          font-size: 48px;
          line-height: 60px;
        `;
      case "h4":
        return css`
          font-size: 36px;
          line-height: 44px;
        `;
      case "h5":
        return css`
          font-size: 30px;
          line-height: 38px;
        `;
      case "h6":
        return css`
          font-size: 24px;
          line-height: 32px;
        `;
      case "subtitle1":
        return css`
          font-size: 20px;
          line-height: 30px;
        `;
      case "body1":
        return css`
          font-size: 16px;
          line-height: 24px;
        `;
      case "body2":
        return css`
          font-size: 12px;
          line-height: 18px;
        `;
      default:
        return css``;
    }
  }};
`;

export const Typography = ({ variant = "body1", children, ...rest }) => {
  return (
    <StyledTypography variant={variant} {...rest}>
      {children}
    </StyledTypography>
  );
};

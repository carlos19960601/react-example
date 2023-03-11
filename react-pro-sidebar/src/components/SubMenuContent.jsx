import { forwardRef, useEffect, useState } from "react";
import styled from "styled-components";
import { useMenu } from "../hook/useMenu";

const StyledSubMenuContent = styled.div`
  display: none;
  overflow: hidden;
  transition: height ${({ transitionDuration }) => transitionDuration}ms;

  ${({ rootStyles }) => rootStyles};
`;

const StyledUl = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const SubMenuContentFR = ({ children, open }, ref) => {
  const SubMenuContentRef = ref;

  const [mounted, setMounted] = useState(false);

  const { transitionDuration } = useMenu();

  useEffect(() => {
    if (mounted) {
      if (open) {
        const target = SubMenuContentRef?.current;
        if (target) {
          target.style.display = "block";
          target.style.overflow = "hidden";
          target.style.height = "auto";
          const height = target.offsetHeight;
        }
      } else {
        const target = SubMenuContentRef?.current;
        if (target) {
        }
      }
    }
  }, [open, SubMenuContentRef]);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <StyledSubMenuContent
      ref={ref}
      open={open}
      transitionDuration={transitionDuration}
    >
      <StyledUl>{children}</StyledUl>
    </StyledSubMenuContent>
  );
};

export const SubMenuContent = forwardRef(SubMenuContentFR);

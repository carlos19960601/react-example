import { styled } from "@affine/component";
import { useTranslation } from "@affine/i18n";

const StyledLoadingContainer = styled("div")`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #6880ff;
  h1 {
    font-size: 2em;
    margin-top: 15px;
    font-weight: 600;
  }
`;

export const PageLoading = ({ text }) => {
  const { t } = useTranslation();
  return (
    <StyledLoadingContainer>
      <div className="wrapper">
        <h1>{text ? text : t("Loading")}</h1>
      </div>
    </StyledLoadingContainer>
  );
};

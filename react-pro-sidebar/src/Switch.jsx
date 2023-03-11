import styled from "styled-components";

const CheckBoxWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const CheckBoxLabel = styled.label`
  margin-left: 10px;
  margin-right: 10px;
  font-size: 13px;
  cursor: pointer;
`;

const CheckBox = styled.div`
  position: relative;
  cursor: pointer;
  width: 32px;
  height: 20px;
  border-radius: 30px;
  background-color: ${(props) => (props.checked ? "#0ed693" : "#dde0e7")};
`;

const CheckBoxCircle = styled.div`
  position: absolute;
  background-color: #fff;
  top: 3px;
  left: ${(props) => (props.checked ? "15px" : "3px")};
  width: 14px;
  height: 14px;
  border-radius: 50%;
  transition: left 0.2s;
`;

export const Switch = ({ label, checked, ...rest }) => {
  return (
    <CheckBoxWrapper>
      <CheckBox>
        <input
          type="checkbox"
          checked={checked}
          style={{
            cursor: "pointer",
            width: "32px",
            height: "20px",
            opacity: 0,
            zIndex: 2,
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
          {...rest}
        />
        <CheckBoxCircle checked={checked} />
      </CheckBox>
      {label && <CheckBoxLabel>{label}</CheckBoxLabel>}
    </CheckBoxWrapper>
  );
};

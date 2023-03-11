import { createGlobalStyle } from "styled-components";
import Poppins from "../assets/fonts/Poppins-Bold.ttf";

const GlobalStyles = createGlobalStyle`
@font-face {
  font-family: "Poppins";
  src: url(${Poppins});
}

body {
  font-family: Poppins;
  height: 100vh;
}

#root{
  height: 100%
}
`;

export default GlobalStyles;

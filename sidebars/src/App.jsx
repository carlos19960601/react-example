import { useState } from "react";
import styled from "styled-components";

const Layout = styled.div``;

const Left = styled.div``;
const Main = styled.div``;
const Right = styled.div``;

function App() {
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);

  return (
    <Layout>
      <Left>
        
      </Left>
      <Main></Main>
      <Right></Right>
    </Layout>
  );
}

export default App;

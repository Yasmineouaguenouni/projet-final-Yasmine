import styled from "styled-components";

import { FaBomb } from "react-icons/fa";

const Error = () => {
  return (
    <Wrapper>
      <FaBomb width={"4rem"} height={"4rem"} />
      <h1>An unknown error has occured.</h1>
      <p>Refreshing the page might resolve the issue.</p>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  grid-area: center;
  display: flex;
  flex-direction: column;
  height: 100vh;
  align-items: center;
  justify-content: center;
`;

export default Error;

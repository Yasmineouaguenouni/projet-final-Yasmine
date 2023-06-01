import styled from "styled-components";
import { FiLoader } from "react-icons/fi";

const Loading = () => {
  return (
    <Spin>
      <FiLoader />
    </Spin>
  );
};

const Spin = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;

  & svg {
    height: 2rem;
    width: 2rem;
    animation: spin 1.5s linear infinite;
    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  }
`;

export default Loading;

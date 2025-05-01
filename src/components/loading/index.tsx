import { Flex, Spin } from "antd";
import { Typography } from "antd";
import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const AnimatedTitle = styled(Typography.Title)`
  animation: ${fadeIn} 1s ease-out;
`;

export const LoadingPage: React.FC = () => {

  return (
    <Flex
      style={{
        height: "100vh",
        width: "100vw",
        position: "fixed",
        top: 0,
        left: 0,
        background: '#000'
      }}
      vertical
      gap="middle"
      justify="center"
      align="center"
    >
      <AnimatedTitle
        level={2}
        style={{ color: '#fff' }}
      >
        Welcome
      </AnimatedTitle>
      <Spin size="large" />
    </Flex>
  );
};

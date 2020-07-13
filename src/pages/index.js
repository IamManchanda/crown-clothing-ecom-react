import React, { Profiler } from "react";
import styled from "styled-components";

import DirectoryMenu from "../components/directory-menu";

const HomePageStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const HomePage = () => (
  <HomePageStyled>
    <Profiler
      id="Directory"
      onRender={(id, phase, actualDuration) => {
        console.log({ id, phase, actualDuration });
      }}
    >
      <DirectoryMenu />
    </Profiler>
  </HomePageStyled>
);

export default HomePage;

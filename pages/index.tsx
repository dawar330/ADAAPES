import styled from "styled-components";
import Collections from "../components/Home/Collections";
import Faqs from "../components/Home/Faqs";
import Roadmap from "../components/Home/Roadmap";
import Team from "../components/Home/Team";
import Utilities from "../components/Home/Utilities";
import Welcome from "../components/Home/Welcome";
import Season from "../components/Season";

export default function Index() {
  return (
    <StyledIndex>
      <Season
        title="ONE"
        images={[
          "/images/394-1024x1024-1-1.png",
          "/images/S1-2.png",
          "/images/831-300x300-1.png",
          "/images/S1-4-1.png",
          "/images/2085-300x300-1.png",
          "/images/S1-3-1-2.png",
          "/images/394-1024x1024-1-1.png",
          "/images/2346-300x300-1.png",
          "/images/1140-300x300-1.png",
          "/images/S1-2.png",
        ]}
      >
        <h3>[ SOLD OUT ]</h3>
      </Season>
      <Season
        title="TWO"
        images={[
          "/images/1.png",
          "/images/2.png",
          "/images/3-1.png",
          "/images/4-1.png",
          "/images/5.png",
          "/images/6.png",
          "/images/7.png",
          "/images/8.png",
          "/images/9-1.png",
          "/images/10.png",
        ]}
      >
        <h3>[ SOLD OUT ]</h3>
      </Season>
      <Welcome />
      <Roadmap />
      <Utilities />
      <Collections />
      <Faqs />
      <Team />
    </StyledIndex>
  );
}

const StyledIndex = styled.main`
  padding: 2rem 0 0;
`;

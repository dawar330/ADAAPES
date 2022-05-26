import styled from "styled-components";
import { useRef, useEffect } from "react";
import Lottie from "lottie-web";
import Image from "next/image";
import anim4 from "../../assets/lottie/banana.json";

export default function Team() {
  const bananaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!bananaRef.current?.children.length) {
      Lottie.loadAnimation({
        container: bananaRef.current as HTMLDivElement,
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData: anim4,
        rendererSettings: {
          progressiveLoad: true,
        },
      });
    }
  }, []);

  return (
    <StyledTeam>
      <h1>
        KINGS OF THE JUNGLE <span ref={bananaRef}></span>
      </h1>
      <div className="team">
        <div className="team-member">
          <Image src="/images/website-art-2-1.svg" alt="" layout="fill" />
          <h3>FRED</h3>
          <p>PROJECT LEAD</p>
        </div>
        <div className="team-member">
          <Image src="/images/website-art-3.svg" alt="" layout="fill" />
          <h3>ANDREW</h3>
          <p>PROJECT MANAGEMENT</p>
        </div>
        <div className="team-member">
          <Image src="/images/23-47.svg" alt="" layout="fill" />
          <h3>YAN</h3>
          <p>ART & DESIGN</p>
        </div>
        <div className="team-member">
          <Image
            src="/images/Ape---Complete-1_1x_1-1.svg"
            alt=""
            layout="fill"
          />
          <h3>FRANZ</h3>
          <p>WEB DESIGN/DEV</p>
        </div>
      </div>
    </StyledTeam>
  );
}

const StyledTeam = styled.section`
  padding: 6rem 2rem 4rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  h1 {
    font-size: 4rem;
    line-height: 1;
    display: flex;
    align-items: center;
    span {
      display: inline-block;
      height: 4.2rem;
      width: 4.2rem;
    }
  }
  .team {
    margin: 6rem 0;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 6rem;
    width: 100%;
    max-width: 1280px;
    &-member {
      width: 100%;
      aspect-ratio: 1;
      position: relative;
      h3 {
        position: absolute;
        bottom: -1rem;
        left: -1.5rem;
        transform-origin: left center;
        transform: rotate(-90deg);
        font-size: 2rem;
        line-height: 1;
      }
      p {
        position: absolute;
        bottom: -2rem;
        left: 0;
        font-size: 1.2rem;
        line-height: 1;
      }
      &::after {
        content: "";
        position: absolute;
        left: 0;
        bottom: 0;
        transform: translate(-50%, 50%);
        width: 200%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
        background-image: radial-gradient(
          circle farthest-corner at 50% 50%,
          rgba(114, 255, 255, 0.15),
          rgba(115, 241, 255, 0.1) 14%,
          rgba(58, 220, 255, 0.06) 31%,
          rgba(133, 233, 255, 0.01) 45%,
          hsla(0, 0%, 100%, 0) 56%,
          hsla(0, 0%, 100%, 0) 72%,
          hsla(0, 0%, 100%, 0) 104%
        );
      }
    }
  }
`;

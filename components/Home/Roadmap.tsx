import { useRef, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";

export default function Roadmap() {
  gsap.registerPlugin(ScrollTrigger);

  const slideRef = useRef<HTMLDivElement>(null);
  const slideParentRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.to(slideRef.current, {
      x: -(
        slideRef.current?.offsetWidth! -
        window.innerWidth +
        window.innerWidth / 3
      ),
      ease: "power0.none",
      scrollTrigger: {
        trigger: slideParentRef.current,
        start: "top 12.5%",
        end: slideRef.current?.offsetWidth,
        scrub: 1,
        pin: true,
      },
    });
    gsap.fromTo(
      barRef.current,
      {
        xPercent: -5,
      },
      {
        xPercent: 0,
        ease: "power0.none",
        scrollTrigger: {
          trigger: slideParentRef.current,
          start: "top 12.5%",
          end: slideRef.current?.offsetWidth,
          scrub: 1,
          pin: true,
        },
      }
    );
  }, []);

  return (
    <StyledRoadmap ref={slideParentRef}>
      <div className="gradient"></div>
      <div className="gradient"></div>
      <div className="content">
        <div className="gradient-2"></div>
        <h1>ROADMAP</h1>
        <div className="slide">
          <div className="bar" ref={barRef}></div>
          <div className="movement-wrapper" ref={slideRef}>
            <div className="item">
              <h3>Staking</h3>
              <p>
                Staking is still in development and is expected to be completed
                during Q1 of 2022. It will consist of locking in your Ada Ape
                Club NFT and being rewarded with our AAC tokens. These tokens
                can be used to purchase upgrades for your NFTs from weekly
                randomized traits.
                <br />
                <br />
                AAC Tokens will also be able to purchase future Ada Ape Club
                NFTs, Ada Ape Club merch, & Fight Club accessories.
              </p>
            </div>
            <div className="item">
              <h3>Ada Ape Club VR World</h3>
              <p>
                We are in the planning phase of a VR world which will allow you
                to showcase your NFTs as well as walk around and interact with
                other members in the community.
              </p>
            </div>
            <div className="item">
              <h3>Upgrading Your OG Ada Ape</h3>
              <p>
                We will be airdropping a special but very limited Ada Ape
                Upgrade Banana after Season 2 Mint. Any lucky ape that receives
                this Banana will allow them to transform their Apes into an Ada
                Ape Robot with all new traits as well as a higher staking value
                than your original Season 1 Ape.
                <br />
                <br />
                Your OG Apes will be burned and your Robot Apes traits will be
                rerolled. So choose which OG Ape you upgrade carefully.
              </p>
            </div>
            <div className="item">
              <h3>Promotion & Collaborations</h3>
              <p>
                We will be implementing a marketing strategy that will help
                target CNFT enthusiasts and also will encourage other NFT
                communities from other blockchains to come join The Ada Ape
                Club.
                <br />
                <br />
                This will not only help our community grow stronger but will
                also help the Cardano CNFT Community as a whole.{" "}
              </p>
            </div>
            <div className="item">
              <h3>Public Meet</h3>
              <p>
                The Developers are putting together a meet for all AAC NFT
                Holders so they can meet and talk to the Developers about future
                plans and the direction for the project.
              </p>
            </div>
            <div className="item">
              <h3>Season 2:</h3>
              <p>
                We will be rolling out Season 2 in Q1 Of 2022, which will have
                all new traits/themes as well as utilities that have never been
                seen before.
              </p>
            </div>
            <div className="item">
              <h3>Fight Club</h3>
              <p>
                The AAC Fight Club is a game that allows you to put your skills
                to the test against other Ada Apes. You will be able to
                customize your ape with rewards received from staking as well as
                rewards given out to winners from each fight.
                <br />
                <br />
                This game is currently underdevelopment by our back-end
                developers.
              </p>
            </div>
            <div className="item">
              <h3>Got an idea for the AAC?</h3>
              <p>
                We are always looking for new and fun utilities to introduce to
                the project, if you have any ideas and would like to share, then
                feel free to message the Developers directly or speak to one of
                our Council Members
              </p>
            </div>
          </div>
        </div>
      </div>
    </StyledRoadmap>
  );
}

const pulseKeyframes = keyframes`
  0% {
    transform: scale(0.95) translateY(-50%);
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
  }
  
  70% {
    transform: scale(1) translateY(-50%);
    box-shadow: 0 0 0 10px rgba(255, 255, 255, 0);
  }
  
  100% {
    transform: scale(0.95) translateY(-50%);
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
  }
`;

const StyledRoadmap = styled.section`
  /* min-height: 100vh; */
  padding: 2rem 0;
  position: relative;
  .content {
    width: 100%;
    position: relative;
    overflow: hidden;
  }
  .slide {
    margin-top: 4rem;
    position: relative;
    /* overflow: hidden; */
    overscroll-behavior: none;
    .bar {
      position: absolute;
      top: 0;
      left: 0;
      width: 120%;
      height: 2px;
      background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='white' stroke-width='4' stroke-dasharray='4,20' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e");
    }
    .movement-wrapper {
      position: relative;
      width: fit-content;
      display: flex;
      align-items: flex-start;
      gap: 6rem;
      padding-left: 12rem;
      .item {
        width: fit-content;
        padding: 0;
        position: relative;
        h3 {
          font-size: 1.8rem;
          margin: 2rem 0 1rem;
        }
        p {
          width: 450px;
          font-size: 1.1rem;
          font-weight: bold;
        }
        &::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 1.5rem;
          height: 1.5rem;
          border-radius: 50%;
          background-color: ${({ theme }) => theme.secondary};
          border: 0.5rem solid ${({ theme }) => theme.primary};
          transform: translateY(-50%);
          animation: ${pulseKeyframes} 2s infinite;
        }
      }
    }
  }
  .gradient {
    position: absolute;
    left: -19%;
    top: 3%;
    width: 70%;
    height: 90%;
    transform: translateY(-15%);
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
    pointer-events: none;
  }
  .gradient-2 {
    position: absolute;
    left: 75%;
    top: 22%;
    width: 30%;
    height: 60%;
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
    pointer-events: none;
  }
  h1 {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
    font-size: 4rem;
  }
`;

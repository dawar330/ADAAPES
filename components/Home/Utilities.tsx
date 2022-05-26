import styled from "styled-components";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef } from "react";
import Lottie from "lottie-web";
import anim1 from "../../assets/lottie/ticket.json";
import anim2 from "../../assets/lottie/chest.json";
import anim3 from "../../assets/lottie/padlock.json";

export default function Utilities() {
  const ticketRef = useRef<HTMLDivElement>(null);
  const chestRef = useRef<HTMLDivElement>(null);
  const padlockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ticketRef.current?.children.length) {
      Lottie.loadAnimation({
        container: ticketRef.current as HTMLDivElement,
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData: anim1,
        rendererSettings: {
          progressiveLoad: true,
        },
      });
    }
    if (!chestRef.current?.children.length) {
      Lottie.loadAnimation({
        container: chestRef.current as HTMLDivElement,
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData: anim2,
        rendererSettings: {
          progressiveLoad: true,
        },
      });
    }
    if (!padlockRef.current?.children.length) {
      Lottie.loadAnimation({
        container: padlockRef.current as HTMLDivElement,
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData: anim3,
        rendererSettings: {
          progressiveLoad: true,
        },
      });
    }
  }, []);

  return (
    <StyledUtilities>
      <div className="gradient"></div>
      <div className="gradient-2"></div>
      <div className="content">
        <h1>UTILITIES</h1>
        <div className="list">
          <div className="list__item">
            <div className="list__item__img" ref={ticketRef}></div>
            <div>
              <h3>Golden Ticket</h3>
              <p>
                Anyone who possesses an AAC NFT holding a Golden Ticket will
                automatically qualify for every Airdrop that is given out.
              </p>
            </div>
          </div>
          <div className="list__item">
            <div className="list__item__img" ref={chestRef}></div>
            <div>
              <h3>Treasure Chests</h3>
              <p>
                Treasure Chests are acquired randomly during the Seasonal drops.
                Anyone who receives one will be able to redeem their chest for
                rewards such as ADA, multiple AAC NFTs and much more.
              </p>
            </div>
          </div>
          <div className="list__item">
            <div className="list__item__img" ref={padlockRef}></div>
            <div>
              <h3>Staking</h3>
              <p>
                Staking will be introduced in 2022 which will allow you to
                receive AAC coins that you can redeem for free merch, NFTs,
                Fight club character accessories and much more.
              </p>
            </div>
          </div>
        </div>
      </div>
    </StyledUtilities>
  );
}

const StyledUtilities = styled.section`
  min-height: 100vh;
  display: grid;
  place-items: center;
  position: relative;
  .gradient {
    position: absolute;
    left: -5%;
    top: 0%;
    width: 35%;
    height: 50%;
    pointer-events: none;
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
  .gradient-2 {
    position: absolute;
    right: 10%;
    top: 50%;
    width: 35%;
    height: 130%;
    pointer-events: none;
    transform: translateY(-50%);
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
  h1 {
    font-size: 4rem;
    line-height: 1;
  }
  .content {
    height: 100%;
    width: 100%;
    max-width: 1500px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 2rem;
    padding: 12rem 2rem 4rem;
  }
  .list {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 2rem;
    &__item {
      display: flex;
      align-items: center;
      gap: 4rem;
      h3 {
        font-size: 3rem;
      }
      p {
        font-size: 1.1rem;
        width: 100%;
        max-width: 600px;
        font-weight: bold;
      }
      &__img {
        position: relative;
        width: 150px;
        height: 150px;
        aspect-ratio: 1;
      }
    }
  }
`;

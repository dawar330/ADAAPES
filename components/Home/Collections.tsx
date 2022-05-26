import styled, { keyframes } from "styled-components";
import Image from "next/image";
import { useGlobalStates } from "../../store/global";
import { FancyButton } from "../Button";
import { useEffect, useState } from "react";

export default function Collections() {
  const { visibleCollectionIndex, setVisibleCollectionIndex } =
    useGlobalStates();

  const [imageUrl, setImageUrl] = useState<string>(
    "/images/Season-1-banner.png"
  );

  useEffect(() => {
    if (visibleCollectionIndex === 0) {
      setImageUrl("/images/Season-1-banner.png");
    } else if (visibleCollectionIndex === 1) {
      setImageUrl("/images/christmas-banner-compelte.png");
    } else if (visibleCollectionIndex === 2) {
      setImageUrl("/images/s2-banner.png");
    }
  }, [visibleCollectionIndex]);

  return (
    <StyledCollections>
      <div className="content">
        <div className="gradient"></div>
        <div className="left">
          <h1>COLLECTIONS</h1>
          <div className="controls">
            <FancyButton
              className={visibleCollectionIndex === 0 ? "active" : undefined}
              onClick={() => setVisibleCollectionIndex(0)}
            >
              OG COLLECTION
            </FancyButton>
            <FancyButton
              className={visibleCollectionIndex === 1 ? "active" : undefined}
              onClick={() => setVisibleCollectionIndex(1)}
            >
              HOLIDAY COLLECTION
            </FancyButton>
            <FancyButton
              className={visibleCollectionIndex === 2 ? "active" : undefined}
              onClick={() => setVisibleCollectionIndex(2)}
            >
              SEASON TWO
            </FancyButton>
          </div>
        </div>
        <div className="right">
          <Image src={imageUrl} alt="" layout="fill" quality={80} />
        </div>
      </div>
    </StyledCollections>
  );
}

const dashKeyframes = keyframes`
    to {
        background-position: 100% 0%, 0% 100%, 0% 0%, 100% 100%;
    }
`;

const StyledCollections = styled.section`
  min-height: 100vh;
  display: grid;
  place-items: center;
  position: relative;
  .gradient {
    position: absolute;
    left: -5%;
    top: 20%;
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
    padding: 8rem 2rem 4rem;
    position: relative;
    button {
      font-size: 1.8rem;
      font-weight: 900;
      padding: 1rem 1.3rem;
    }
    .active {
      background: linear-gradient(90deg, #04f4f3 50%, transparent 50%),
        linear-gradient(90deg, #04f4f3 50%, transparent 50%),
        linear-gradient(0deg, #04f4f3 50%, transparent 50%),
        linear-gradient(0deg, #04f4f3 50%, transparent 50%);
      background-repeat: repeat-x, repeat-x, repeat-y, repeat-y;
      background-size: 16px 2px, 16px 2px, 2px 16px, 2px 16px;
      background-position: 0% 0%, 100% 100%, 0% 100%, 100% 0px;
      border: none;
      animation: ${dashKeyframes} 20s linear infinite;
    }
  }
  .controls {
    margin-top: 2rem;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 2rem;
  }
  .left {
    flex: 1;
  }
  .right {
    flex: 1.2;
    height: 100%;
    position: relative;
    margin-top: 2rem;
    img {
      object-fit: contain;
      object-position: top;
    }
  }
`;

import styled from "styled-components";

export default function Welcome() {
  return (
    <StyledWelcome>
      <div className="gradient"></div>
      <div className="content">
        <div>
          <h1>Welcome To The Club</h1>
          <p>
            We are a Collection of unique NFTs on the Cardano Blockchain. We
            have a Season 1 collection of 2500 NFTs, as well as but not
            including, Holiday NFTs and special Utility NFTs.
            <br />
            <br />
            We are always coming out with new utilities for our NFT holders and
            artwork that is simple, clean and fun for the community.
            <br />
            <br />
            Each drop is entirely unique digital art that is centered around our
            community and their interests.
          </p>
        </div>
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/all.gif" alt="nfts" />
        </div>
      </div>
    </StyledWelcome>
  );
}

const StyledWelcome = styled.section`
  min-height: 100vh;
  display: grid;
  place-items: center;
  position: relative;
  /* overflow: hidden; */
  .gradient {
    position: absolute;
    left: -5%;
    top: 5%;
    z-index: 1;
    width: 75%;
    height: 100%;
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
  .content {
    height: 100%;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 2rem;
    padding: 2rem;
    h1 {
      font-size: 4rem;
    }
    p {
      font-size: 1.1rem;
      max-width: 600px;
      font-weight: bold;
      margin-top: 0.5rem;
    }
    div {
      &:first-child {
        flex: 1;
      }
      img {
        width: 100%;
      }
    }
  }
`;

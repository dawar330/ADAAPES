import styled from "styled-components";
import Accordion from "../Accordion";

export default function Faqs() {
  return (
    <StyledFaqs>
      <div className="gradient"></div>
      <h1>FAQ</h1>
      <div className="items">
        <Accordion title="How Much Is It To Mint?">40 Ada + Fees</Accordion>
        <Accordion title="When Is Season 2 Coming Out?">
          Season 2 will be released February 2nd at 9 pm UTC, come join our
          discord server to get in before it{`'`}s too late!!
        </Accordion>
        <Accordion title="Can I still make the Whitelist/Greenlist?">
          Yes, more WL and GL spots are opening up as our community continues to
          grow bigger.
        </Accordion>
        <Accordion title="What are compatible Wallets?">
          There are many wallets now that you can store your Cardano NFTs on,
          Yoroi, NAMI and Daedalus are a few of the most popular.
        </Accordion>
        <Accordion title="How do I qualify for an Airdrop?">
          There are a few ways to receive an airdrop:
          <ul>
            <li>Hold a Season 1 AAC NFT with a Golden ticket</li>

            <li>
              Hold enough Season 1 AAC NFTs to qualify for the Tiered Holders
              Airdrop
            </li>

            <li>Make it onto the VIP Holders List.</li>
          </ul>
        </Accordion>
        <Accordion title="When are the snapshots taken for the Tiered Holders?">
          The snapshots are done at random, afterwards you will receive your
          airdrop for the corresponding tier.
        </Accordion>
        <Accordion title="How can I view my NFTs in my wallet?">
          You can go on <a href="https://pool.pm">https://pool.pm</a> and type
          in your receiving wallet address in the search field, or if you have a
          NAMI wallet you can view your NFTs there.
        </Accordion>
      </div>
    </StyledFaqs>
  );
}

const StyledFaqs = styled.section`
  max-width: 1024px;
  margin: 0 auto;
  padding: 4rem 2rem;
  position: relative;
  .gradient {
    position: absolute;
    left: 10%;
    top: 0%;
    width: 50%;
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
  h1 {
    font-size: 4rem;
    line-height: 1;
  }
  .items {
    margin-top: 2rem;
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
    ul {
      list-style-position: inside;
    }
  }
`;

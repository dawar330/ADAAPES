import styled from "styled-components";
import Link from "next/link";
import Image from "next/image";
import { FaDiscord, FaInstagram, FaTwitter } from "react-icons/fa";
import Button, { CircularButton } from "./Button";

export default function Nav() {
  return (
    <StyledNav>
      <div className="content">
        <div>
          <Link href="/" passHref>
            <a>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/adaapeclublogosvg.svg"
                alt="Ada Ape Club Logo"
              />
            </a>
          </Link>
          <Link href="/#about">About</Link>
          <Link href="/#roadmap">Roadmap</Link>
          <Link href="/#utilities">Utilities</Link>
          <Link href="/#faq">FAQ</Link>
          <Link href="/#donations">Donations</Link>
          <Link href="/staking">Staking</Link>
        </div>
        <div>
          <a
            href="https://twitter.com/AdaApeClub"
            target="_blank"
            rel="noreferrer"
          >
            <FaTwitter />
          </a>
          <a
            href="https://www.instagram.com/adaapeclub"
            target="_blank"
            rel="noreferrer"
          >
            <FaInstagram />
          </a>
          <a
            href="http://discord.gg/adaapeclub"
            target="_blank"
            rel="noreferrer"
          >
            <CircularButton>
              <FaDiscord />
            </CircularButton>
          </a>
          <a
            href="https://www.jpg.store/collection/adaapeclub"
            target="_blank"
            rel="noreferrer"
          >
            <Button>SECONDARY MARKET</Button>
          </a>
        </div>
      </div>
    </StyledNav>
  );
}

const StyledNav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 99;
  background-color: rgba(0, 18, 20, 0.85);
  backdrop-filter: blur(5px);
  .content {
    max-width: 1600px;
    margin: 0 auto;
    padding: 0.8rem 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    div {
      display: flex;
      align-items: center;
      a {
        display: flex;
        align-items: center;
        margin-left: 2rem;
        font-weight: 900;
        transition: all 0.3s ease;
        &:hover,
        &:focus {
          transform: scale(1.05);
        }
        svg {
          font-size: 1.8rem;
        }
      }
      button {
        font-size: 1.1rem;
        line-height: 1;
        font-weight: 900;
      }
    }
  }
`;

import styled from "styled-components";
import Image from "next/image";
import { FaDiscord, FaInstagram, FaTwitter } from "react-icons/fa";
import { CircularButton } from "./Button";
import Link from "next/link";

export default function Footer() {
  return (
    <StyledFooter>
      <div className="upper">
        <div className="upper-left">
          <Image
            src="/images/adaapeclubsvglonglogo.svg"
            alt=""
            width={150}
            height={150}
          />
        </div>
        <div className="upper-right">
          <a href="#">
            <Image
              src="/images/cardaologowhite.svg"
              alt=""
              width={120}
              height={80}
            />
          </a>
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
        </div>
      </div>
      <div className="lower">
        <div>&copy; {new Date().getFullYear()} ADA APE CLUB</div>
        <div>
          <a href="https://www.glxtch.agency/" target="_blank" rel="noreferrer">
            WEBSITE DESIGN BY GLXTCH_
          </a>
        </div>
        <div>
          <Link href="/policy-ids">POLICY IDS</Link>
          <a
            href="https://www.jpg.store/collection/adaapeclub"
            target="_blank"
            rel="noreferrer"
          >
            SECONDARY MARKET
          </a>
        </div>
      </div>
    </StyledFooter>
  );
}

const StyledFooter = styled.div`
  .upper {
    padding: 2rem 6rem 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    &-left {
      flex: auto;
    }
    &-right {
      flex: 1;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      a {
        display: flex;
        align-items: center;
        margin-left: 2rem;
        transition: all 0.3s ease;
        &:first-child {
          margin-right: 1rem;
        }
        svg {
          font-size: 1.8rem;
        }
      }
      button {
        font-size: 1.1rem;
        line-height: 1;
        font-weight: 900;
        &:hover,
        &:focus {
          transform: scale(1.05);
        }
      }
    }
  }
  .lower {
    border-top: 1px solid #1a292c;
    padding: 1rem 6rem;
    font-weight: bold;
    font-size: 0.85rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    div {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
  }
`;

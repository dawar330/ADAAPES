import styled from "styled-components";
import StakingSideNav from "../../components/StakingSideNav";
import Image from "next/image";
import { colors } from "../../styles/colors";
import * as Cardano from "@emurgo/cardano-serialization-lib-asmjs";
import { useEffect, useRef, useState } from "react";
import fromHex from "../../cardano/hex";
import axios from "axios";

export default function Dashboard() {
  const [appHost, setAppHost] = useState(process.env.NEXT_APP_HOST);
  //Working on tokens
  const [adaApeTokens, setAdaApeTokens] = useState<any>('0');
  const [cardanoNumber, setCardanoNumber] = useState<any>('0');
  const [stakedApes, setStakedApes] = useState<any>('0');
  const [dailyReward, setDailyReward] = useState<any>('0');
  const [userName, setUserName] = useState<any>();
  let [isTransactionsLoaded, setIsTransactionsLoaded] = useState(false);


  useEffect(() => {
    if (localStorage.getItem("user") != null && isTransactionsLoaded === false) {
      connectToNamiAndGetAssests();
    }
  }, [isTransactionsLoaded, adaApeTokens, cardanoNumber, stakedApes, dailyReward,]);

  const connectToNamiAndGetAssests = async () => {
    try {
      let data_ = localStorage.getItem('user');
      let tokenData;
      if (data_ != null) {
        tokenData = JSON.parse(data_);
        if (tokenData != null) {
          if (tokenData['name'] != undefined) {
            setUserName(tokenData['name']);
          }
        }
      }
      isTransactionsLoaded = true;
      if (window.cardano != undefined) {
        const promise = await window.cardano.enable(); //allow Nami to be accessible by this application
        const address = await window.cardano.getUsedAddresses(); //get nami wallet addresses
        let walletAddress = Cardano.Address.from_bytes(
          fromHex(address[0])
        ).to_bech32(); //get wallet address in bench32 alphabet
        let data = {
          query: `query {
            getDashboardAssets(Address: "${walletAddress}") {
              adaApeTokens
              cardanoNumber
              stakedApes
              dailyReward
            }
          }`,
        };
        let response = await axios.post(appHost + "/getDashboardAssets", data);
        console.log(response.data.data.getDashboardAssets);
        if (response.data != undefined && response.data.data != undefined && response.data.data.getDashboardAssets != undefined) {
          let assets = response.data.data.getDashboardAssets;
          let apes = Number(assets.stakedApes);//.toFixed(2),
          let reward = (Number(assets.dailyReward) / 10).toFixed(2);
          let tokens = Number(assets.adaApeTokens).toFixed(2);
          let cardano = Number(assets.cardanoNumber).toFixed(2);
          setStakedApes(apes);
          setDailyReward(reward);
          setAdaApeTokens(tokens);
          setCardanoNumber(cardano);
        }

        //toast.error(          "Nami extension is not found in browser! Check if it is installed"        );
      }
    } catch (ex) {
      console.error(ex);
    }
  };

  return (
    <Flex>
      <StakingSideNav />
      <StyledDashboard>
        <div className="gradient"></div>
        <div className="heading">
          <h1>Dashboard</h1>
          <button onClick={connectToNamiAndGetAssests}>UPDATE BALANCE</button>
        </div>
        <p>
          Welcome to your dashboard {userName}. If your balance is not updated
          yet, you can update it manually by clicking the “Update Balance”
          button on the top right of this page.
        </p>
        <p>
          If you need to connect your wallet you can visit the connect wallet
          page, and to make withdrawals or deposits you can visit the transfer
          page.
        </p>
        <div className="info">
          <div className="info__item">
            <div className="info__item-wrapper">
              <div className="info__item-image">
                <Image src="/images/aactokenpng.png" alt="" layout="fill" />
              </div>
              <div className="info__item-details">
                <h3>
                  Ada Ape Tokens <span>AA</span>
                </h3>
                <p>{adaApeTokens}</p>
              </div>
            </div>
          </div>
          <div className="info__item">
            <div className="info__item-wrapper">
              <div className="info__item-image">
                <Image src="/images/image0-2.png" alt="" layout="fill" />
              </div>
              <div className="info__item-details">
                <h3>UnClaimed Rewards</h3>
                <p>{dailyReward}</p>
              </div>
            </div>
          </div>
          <div className="info__item">
            <div className="info__item-wrapper">
              <div className="info__item-image">
                <Image
                  src="/images/cardano_ada-512-1.png"
                  alt=""
                  layout="fill"
                />
              </div>
              <div className="info__item-details">
                <h3>
                  Cardano <span>ADA</span>
                </h3>
                <p>{cardanoNumber}</p>
              </div>
            </div>
          </div>
          <div className="info__item">
            <div className="info__item-wrapper">
              <div className="info__item-image">
                <Image src="/images/all.gif" alt="" layout="fill" />
              </div>
              <div className="info__item-details">
                <h3>Staked Apes</h3>
                <p>{stakedApes}</p>
              </div>
            </div>
          </div>
        </div>
      </StyledDashboard>
    </Flex>
  );
}

const Flex = styled.main`
  padding: 12rem 2rem 4rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
  max-width: 1460px;
  margin: 0 auto;
`;

const StyledDashboard = styled.section`
  padding: 0 4rem 8rem 0;
  min-height: 100vh;
  flex: 1;
  .gradient {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 100%;
    height: 100%;
    transform: translate(-50%, -50%);
    pointer-events: none;
    z-index: -1;
    background-image: radial-gradient(
      circle farthest-corner at 50% 50%,
      rgba(114, 255, 255, 0.1),
      rgba(115, 241, 255, 0.08) 14%,
      rgba(58, 220, 255, 0.06) 31%,
      rgba(133, 233, 255, 0.01) 45%,
      hsla(0, 0%, 100%, 0) 56%,
      hsla(0, 0%, 100%, 0) 72%,
      hsla(0, 0%, 100%, 0) 104%
    );
  }
  h1 {
    font-size: 2rem;
  }
  p {
    font-size: 0.9rem;
    margin-top: 1rem;
    /* max-width: 768px; */
  }
  .heading {
    padding-bottom: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    button {
      border: 1px solid ${({ theme }) => theme.secondary};
      color: ${({ theme }) => theme.secondary};
      border-radius: 0.4rem;
      padding: 0.6rem 1rem;
      font-size: 0.9rem;
      background-color: rgba(56, 152, 236, 0);
      transition: all 0.3s ease;
      font-weight: 900;
      cursor: pointer;
      &:hover,
      &:focus {
        color: ${({ theme }) => theme.primary};
        border: 1px solid ${({ theme }) => theme.primary};
        box-shadow: 0 0 3px 1px ${({ theme }) => theme.primary};
      }
    }
  }
  .info {
    margin-top: 3rem;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 3rem;
    &__item {
      background-color: transparent;
      padding: 2px;
      border-radius: 50px;
      overflow: hidden;
      &:nth-child(1) {
        background-image: linear-gradient(
          135deg,
          #c98d3d,
          rgba(201, 141, 62, 0.2)
        );
      }
      &:nth-child(2) {
        background-image: linear-gradient(
          90deg,
          #04f49e,
          rgba(4, 244, 154, 0.2)
        );
      }
      &:nth-child(3) {
        background-image: linear-gradient(
          90deg,
          #3468d1,
          rgba(4, 71, 243, 0.3)
        );
      }
      &:nth-child(4) {
        background-image: linear-gradient(
          90deg,
          #04f4f3,
          rgba(114, 255, 255, 0.2)
        );
      }
      &-wrapper {
        border-radius: 50px;
        background-color: #001114;
        padding: 2rem 3rem;
        display: flex;
        align-items: center;
        gap: 2rem;
      }
      &-image {
        position: relative;
        width: 80px;
        height: 80px;
        border-radius: 50%;
        overflow: hidden;
        img {
          object-fit: cover;
        }
      }
      &-details {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        h3 {
          font-size: 1.1rem;
          line-height: 1;
          color: #b3b3b3;
          font-weight: bold;
          span {
            margin-left: 0.5rem;
            font-size: 1.2rem;
            font-weight: 900;
            color: ${({ theme }) => theme.secondary};
          }
        }
        p {
          font-family: "Radwave";
          margin: 0;
          font-size: 1.3rem;
        }
      }
    }
  }
`;

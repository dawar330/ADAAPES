import { useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import StakingSideNav from "../../components/StakingSideNav";
import { colors } from "../../styles/colors";
import { MdCopyAll } from "react-icons/md";
import toast from "react-hot-toast";
import Image from "next/image";
import axios from "axios";
import { toLovelace } from "../../cardano/cardanoHelper";
import fromHex from "../../cardano/hex";
import * as Cardano from "@emurgo/cardano-serialization-lib-asmjs";
import { transferAda } from "../../cardano/Market";
declare global {
  interface Window {
    cardano: any;
  }
}

export default function Transfer() {
  const [appHost, setAppHost] = useState(process.env.NEXT_APP_HOST);
  let [isTransactionsLoaded, setIsTransactionsLoaded] = useState(false);
  let [tableRows, setTableRows] = useState([]);
  const [walletAddress, setwalletAddress] = useState<any>(null);
  const [rewards, setRewards] = useState<any>(0);
  useEffect(() => {
    if (isTransactionsLoaded === false) {
      getAddress();
    }
  }, [isTransactionsLoaded]);

  const unStakeNft = async (price: Number) => {
    let response = await transferAda(toLovelace(price));
    if (response.error !== undefined && response.error !== null) {
      if (response.error === "Fee not specified") {
        toast.error(
          "This cannot be done you don't have sufficient balance in your wallet."
        );
      }
      // else if(response.error.info!==undefined && response.error.info==="User declined to sign the transaction."){
      //   toast("Rewards are not claimed!");
      // }
    } else if (response.txHash !== null) {
      ClaimRewards(walletAddress);
      toast.success("Rewards Claimed !");
    }
    console.log(response);
  };
  const fetchTransactions = async (waletAddress: any) => {
    /***Displaying transactions detail */
    try {
      isTransactionsLoaded = true;
      let data = {
        query: `query {
          getTransactions(Address: "${waletAddress}") {
            reward   
            transactions {
              reward
              date
              walletaddress
              withdrwal
            }
          }
        }`,
      };
      let response = await axios.post(appHost + "/getTransactions", data);
      console.log(response.data.data.getTransactions);
      if (
        response.data != undefined &&
        response.data.data != undefined &&
        response.data.data.getTransactions != undefined &&
        response.data.data.getTransactions.transactions != undefined &&
        response.data.data.getTransactions.reward != undefined
      ) {
        let transactionsData = response.data.data.getTransactions.transactions;
        let indexes = 0;
        let rows = transactionsData.map((record: any) => {
          let date = new Date(record.date);

          return (
            <div className="table__main-row" key={indexes++}>
              <div className="table__main-row-left">
                <Image
                  src="/images/aactokenpng.png"
                  alt=""
                  width={54}
                  height={54}
                />
                <div>
                  <h4>AAC TOKEN</h4>
                  <p>{record.walletaddress}</p>
                </div>
              </div>
              <div className="table__main-row-right">
                <h5>{(Number(record.reward) / 10).toFixed(2)}</h5>
                <span>
                  {date.getDate() +
                    "-" +
                    (date.getMonth() + 1) +
                    "-" +
                    date.getFullYear()}
                </span>
              </div>
            </div>
          );
        });

        let reward = (
          Number(response.data.data.getTransactions.reward) / 10
        ).toFixed(2);
        setRewards(reward);
        setTableRows(rows);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const getrewards = async (address: string) => {
    let data = {
      query: `query {
          getRewardOnWalletAddress(address: "${address}") {
          dailyReward
          }
        }`,
    };
    let response = await axios.post(
      appHost + "/getRewardOnWalletAddress",
      data
    );
    console.log(response.data.data.getRewardOnWalletAddress.dailyReward);

    setRewards(response.data.data.getRewardOnWalletAddress.dailyReward);
  };
  const ClaimRewards = async (address: string) => {
    let data = {
      query: `mutation {
        setTransactionToWidthdrawal(Address: "${address}") {
          dailyReward
        }
      }`,
    };
    let response = await axios.post(
      appHost + "/setTransactionToWidthdrawal",
      data
    );
    console.log(response.data.data.setTransactionToWidthdrawal.dailyReward);

    setRewards(response.data.data.setTransactionToWidthdrawal.dailyReward);
  };
  const getAddress = async () => {
    const address = await window.cardano.getUsedAddresses();
    var walletAddr = Cardano.Address.from_bytes(
      fromHex(address[0])
    ).to_bech32();
    setwalletAddress(walletAddr);
    await fetchTransactions(walletAddr);
  };

  return (
    <Flex>
      <StakingSideNav />
      <StyledTransfer>
        <div className="gradient"></div>
        <h1>Withdraw</h1>
        <div className="table">
          <div className="table__info">
            <button>WITHDRAW AA</button>
          </div>
          <div className="table__main">
            <form onSubmit={(e) => e.preventDefault()}>
              <label>
                <h3>
                  Withdraw{" "}
                  <span>
                    Balance: <b>{rewards}</b>
                  </span>
                </h3>
                <input
                  disabled
                  type="text"
                  defaultValue=""
                  placeholder={rewards ? rewards : "Enter an amount here..."}
                />
              </label>
              <label>
                <h3>Withdrawal Address</h3>

                <input
                  type="text"
                  defaultValue=""
                  placeholder={
                    walletAddress
                      ? walletAddress
                      : "Enter your wallet address here..."
                  }
                />
              </label>
              <p>
                <span>*ONLY</span> withdraw to a Cardano based wallet such as
                NAMI or CCVAULT. Do NOT withdraw to an exchange wallet like
                Binance!
              </p>
              <button
                onClick={() => {
                  if (rewards > 0) {
                    unStakeNft(10);
                  } else {
                    toast.error("No Rewards to be Claimed !");
                  }
                }}
              >
                INITIATE TRANSFER
              </button>
            </form>
          </div>
        </div>
        <div className="table">
          <div className="table__info">
            <button>TRANSACTIONS</button>
          </div>
          <div className="table__main">
            {tableRows != undefined && tableRows.length > 0 ? tableRows : <></>}
          </div>
        </div>
      </StyledTransfer>
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

const StyledTransfer = styled.section`
  padding: 0 0 8rem 0;
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
    max-width: 768px;
  }

  input {
    margin-top: 1rem;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: transparent;
    border: 1px dashed #8a8a8a;
    border-radius: 5px;
    font-weight: bold;
    font-size: 0.8rem;
    padding: 0.5rem 1rem;
    color: ${({ theme }) => theme.secondary};
    transition: all 0.2s ease-in-out;
    outline: none;
    svg {
      font-size: 1rem;
    }
    &:hover,
    &:focus {
      border: 1px dashed ${({ theme }) => theme.quaternary};
    }
  }
  .table {
    margin-top: 3rem;
    background-image: linear-gradient(90deg, #04f4f3, rgba(114, 255, 255, 0.2));
    padding: 2px;
    border-radius: 50px;
    overflow: hidden;
    &:last-child {
      background-image: linear-gradient(
        90deg,
        #3468d1,
        rgba(52, 104, 210, 0.2)
      );
      .table__info {
        button {
          background-color: rgba(56, 152, 236, 0.1);
          color: #3468d1;
        }
      }
    }
    &__info {
      padding: 2.5rem 3rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 900;
      border-radius: 50px 50px 0 0;
      background: #001114;
      margin-bottom: 2px;
      h3 {
        font-size: 1rem;
      }
      button {
        font-weight: 900;
        font-size: 0.9rem;
        padding: 1rem 1.5rem;
        border: 0.05rem solid hsla(0, 0%, 100%, 0.1);
        border-radius: 25px;
        background-color: rgba(4, 244, 243, 0.05);
        color: #04f4f3;
      }
    }
    &__main {
      padding: 2.5rem 3rem;
      border-radius: 0 0 50px 50px;
      background: #001114;
      form {
        display: grid;
        grid-template-columns: 1fr;
        gap: 2rem;
        h3 {
          font-size: 0.9rem;
          font-weight: bold;
          display: flex;
          justify-content: space-between;
          align-items: center;
          line-height: 1;
          span {
            font-size: 0.8rem;
            color: #bfc2c3;
            b {
              color: ${({ theme }) => theme.primary};
              font-family: "Radwave";
            }
          }
        }
        label {
          display: block;
        }
        p {
          margin: 0;
          font-size: 0.7rem;
          span {
            color: ${({ theme }) => theme.primary};
          }
        }
        button {
          width: 100%;
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
      &-row {
        padding: 0.8rem 2rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-weight: bold;
        width: 100%;
        gap: 2rem;
        border: 1px solid hsla(0, 0%, 100%, 0.1);
        border-radius: 50px;
        font-size: 0.8rem;
        &-left {
          display: flex;
          align-items: center;
          gap: 1rem;
          h4 {
            color: #bfc2c3;
            font-size: 0.9rem;
          }
          p {
            margin: 0.125rem 0 0;
            font-size: 0.7rem;
          }
        }
        &-right {
          text-align: right;
          h5 {
            font-size: 0.8rem;
            font-family: "Radwave";
            margin-bottom: 0.25rem;
          }
          span {
            display: block;
            color: #bfc2c3;
            font-size: 0.7rem;
          }
        }
      }
    }
  }
`;

import styled from "styled-components";
import StakingSideNav from "../../components/StakingSideNav";
import { colors } from "../../styles/colors";
import { MdCopyAll, MdClose } from "react-icons/md";
import { FancyButton } from "../../components/Button";
import toast from "react-hot-toast";
import * as Cardano from "@emurgo/cardano-serialization-lib-asmjs";
import fromHex from "../../cardano/hex";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
declare global {
  interface Window {
    cardano: any;
  }
}
export default function Connect() {
  const [appHost, setAppHost] = useState(process.env.NEXT_APP_HOST);
  const [namiWalletAddress, setNamiWalletAddress] = useState<string>(
    "Kindly connect to wallet in order to get your wallet address"
  ); // 56t90535899340859934085439058049583543543534345435435343454345430945889789698687tg394

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success("Copied to clipboard", {
        duration: 2000,
      });
    });
  };

  const connectToNami = async () => {
    try {
      if (window.cardano != undefined) {
        const promise = await window.cardano.enable(); //allow Nami to be accessible by this application
        const address = await window.cardano.getUsedAddresses(); //get nami wallet addresses

        //get Cardano serialization instance
        let walletAddress = Cardano.Address.from_bytes(
          fromHex(address[0])
        ).to_bech32(); //get wallet address in bench32 alphabet
        // UpdateUserWalletAddress
        let item_ = localStorage.getItem("user");
        let item = item_ != null ? JSON.parse(item_) : null;
        let email = item != null ? item["userEmail"] : null;
        let data = {
          query: `mutation {
            UpdateUserWalletAddress(Info: {email:"${email}", walletaddress:"${walletAddress}"}) {
                name
                email
                walletaddress
            }
          }`,
        };
        let response = await axios.post(
          appHost + "/UpdateUserWalletAddress",
          data
        );


        setNamiWalletAddress(walletAddress);//setting value 
        toast.success("Wallet is connected successfully!");
      }
      else {
        toast.error(

          "Nami extension is not found in browser! Check if it is installed"
        );
      }
    } catch (ex) {
      console.error(ex);
    }
  };
  const handleOnMouseOver=(event:any)=>{
    event.target.style.fontSize="2rem";
    event.target.style.cursor="pointer";
  }
  const handleMouseLeave=(event:any)=>{
    event.target.style.fontSize="1.3rem";
    // event.target.style.cursor="alias";
  }
  return (
    <Flex>
      <StakingSideNav />
      <StyledConnect>
        <div className="gradient"></div>
        <h1>Connect Your Wallet</h1>
        <h3>
          How To <span onClick={connectToNami} onMouseOver={handleOnMouseOver} onMouseLeave={handleMouseLeave}>Connect</span> Your Wallet
        </h3>
        <p>
          To connect your wallet, please send xxxx ADA to the wallet address
          located below. You only need to connect your wallet once, unless you
          want to connect multiple wallets.
        </p>
        {/*<div className="address">
          <h4>Address</h4>
          <button onClick={() => copyToClipboard("HEY!")}>
            INSERT ADDRESS HERE
            <MdCopyAll />
          </button>
  </div>*/}
        <div className="table">
          <div className="table__info">
            <button>CONNECTED WALLETS</button>
          </div>
          <div className="table__main">
            <div className="table__main-row">{namiWalletAddress}</div>
          </div>
        </div>

        {/*showModal && (
          <Modal>
            <div className="box">
              <button className="close" onClick={() => setShowModal(false)}>
                <MdClose />
              </button>
              <h3>Modal Message</h3>
              <p>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                Voluptatum, minus.
              </p>
              <div className="action">
                <FancyButton
                  onClick={() => {
                    setShowModal(false);
                    toast.success("Staking Successful!");
                  }}
                >
                  Proceed
                </FancyButton>
              </div>
            </div>
          </Modal>
                )*/}
      </StyledConnect>
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

const StyledConnect = styled.section`
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
  h3 {
    font-size: 1.3rem;
    margin-top: 1rem;
    span {
      color: ${({ theme }) => theme.quaternary};
    }
  }
  p {
    font-size: 0.9rem;
    margin-top: 1rem;
    max-width: 768px;
  }
  .address {
    max-width: 768px;
    margin-top: 2rem;
    h4 {
      font-size: 1rem;
    }
    button {
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
      cursor: pointer;
      svg {
        font-size: 1rem;
      }
      &:hover,
      &:focus {
        border: 1px dashed ${({ theme }) => theme.quaternary};
      }
    }
  }
  .table {
    margin-top: 3rem;
    background-image: linear-gradient(90deg, #00ce78, rgba(0, 206, 119, 0.2));
    padding: 2px;
    border-radius: 50px;
    overflow: hidden;
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
        border-style: solid;
        border-width: 0.05em;
        border-color: hsla(0, 0%, 100%, 0.1);
        border-radius: 25px;
        background-color: rgba(0, 206, 120, 0.1);
        color: #00ce78;
      }
    }
    &__main {
      padding: 2rem 3rem;
      border-radius: 0 0 50px 50px;
      background: #001114;
      &-row {
        padding: 0.8rem 2rem;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        font-weight: bold;
        width: 100%;
        gap: 2rem;
        border: 1px solid hsla(0, 0%, 100%, 0.1);
        border-radius: 50px;
        font-size: 0.8rem;
      }
    }
  }
`;

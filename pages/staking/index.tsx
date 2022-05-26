import { useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import Image from "next/image";
import StakingSideNav from "../../components/StakingSideNav";
import { FancyButton } from "../../components/Button";
import { MdClose } from "react-icons/md";
import toast from "react-hot-toast";
import axios from "axios";
import * as Cardano from "@emurgo/cardano-serialization-lib-asmjs";
import fromHex from "../../cardano/hex";
import { toHex } from "../../cardano/hex";
import {
  buildRedeemTokenFromPlutusScript,
  unStakeNFT,
} from "../../cardano/Market.js";
import {
  finalizeTxBack,
  getLockedUtxosByAsset,
} from "../../cardano/cardanoHelper.js";
import contract from "../../cardano/plutus.js";
export default function Staking() {
  const [appHost, setAppHost] = useState(process.env.NEXT_APP_HOST);
  const [showModal, setShowModal] = useState(false);
  const [showStakeModal, setShowStakeModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  let [addressVal, setAddressVal] = useState("");
  let [tableRows, setTableRows] = useState([]);
  const [stakeNFTSeason, setStakeNFTSeason] = useState("");
  const [stakeNFTName, setStakeNFTName] = useState("");
  const [Datum, setDatum] = useState();
  const [stakeNFTImage, setStakeNFTImage] = useState("");
  const [stakeNFTWalletaddress, setStakeNFTWalletaddress] = useState("");
  const [totalStakedNFT, setTotalStakedNFT] = useState(0);
  const [totalReward, setTotalReward] = useState("");
  const [Policy, setPolicy] = useState();
  //callbacks
  const handleShowAddressModal = useCallback(
    () => setShowAddressModal((showAddressModal) => !showAddressModal),
    []
  );
  const handleAddressVal = useCallback(
    (e) => setAddressVal((e.target as HTMLInputElement).value),
    []
  );
  console.log(
    "TIME 6 Months ",
    (Math.floor(new Date().getTime() / 1000.0) + 15778458) * 1000,
    "1 Year",
    (Math.floor(new Date().getTime() / 1000.0) + 31556926) * 1000
  );

  let [isApesFetched, setIsApesFetched] = useState(false);

  useEffect(() => {
    if (isApesFetched === false) {
      connectToNamiAndGetApes();
    }
  }, [isApesFetched]);

  const connectToNamiAndGetApes = async () => {
    try {
      isApesFetched = true;

      if (localStorage.getItem("user") != null && window.cardano != undefined) {
        const promise = await window.cardano.enable(); //allow Nami to be accessible by this application
        const address = await window.cardano.getUsedAddresses(); //get nami wallet addresses
        let walletAddress = Cardano.Address.from_bytes(
          fromHex(address[0])
        ).to_bech32(); //get wallet address in bench32 alphabet

        addressVal = walletAddress;
        fetchApes();
      }
    } catch (ex) {
      console.log(ex);
    }
  };

  //fetching apes card
  const fetchApes = async () => {
    try {
      console.log("address val..", addressVal);
      if (addressVal != undefined && addressVal != "") {
        let data = {
          query: `mutation {
          getUtxoss(Address: "${addressVal}") {
            name
            amount
            percentage
            perFeature
            reward
            policy
            season
            image
            staked
            datum {
              tn
              cs
              beneficiary
              deadline
            }
          }
        }`,
        };
        let response = await axios.post(appHost + "/getUtxoss", data);
        // console.log(response.data.data.getUtxoss,"THIS IS RESPONSE");
        if (
          response.data != undefined &&
          response.data.data != undefined &&
          response.data.data.getUtxoss != undefined
        ) {
          let stakeData = response.data.data.getUtxoss;

          let indexes = 0,
            countStaked = 0,
            countReward = 0;
          let rows = stakeData.map((record: any) => {
            setStakeNFTName(record.name);
            setDatum(record.datum);
            setPolicy(record.datum.cs);

            let image = "",
              staked = false;
            if (record.image != null && record.image != "") {
              image = record.image.replace("ipfs://", "https://ipfs.io/ipfs/");
            } else {
              image = "https://ipfs.io/ipfs/";
            }
            // console.log("image.....",indexes,image);
            if (record.staked != undefined && record.staked == true) {
              staked = true;
              countStaked += 1;
            }
            if (staked === true && record.reward != null) {
              countReward += Number(record.reward);
            }
            return (
              <div className="table__main-row" key={indexes + ""}>
                <Image
                  className="avatar"
                  src={image} //"/images/Group-69.png"}
                  alt="avatar"
                  width={64}
                  height={64}
                />
                <div>
                  <p>{indexes++}</p>
                  <p>{record.name}</p>
                  <p>{record.season}</p>
                  <p>
                    {record.reward == null ? (
                      <>0</>
                    ) : (
                      <>{Number(record.reward).toFixed(2)}</>
                    )}
                  </p>
                  <p>
                    {staked == true ? (
                      <a id="primarya">Staked</a>
                    ) : (
                      <a id="errorMsg">Not Staked</a>
                    )}
                  </p>
                  {staked == true ? (
                    <button
                      onClick={() => {
                        setUnStakeDataAndShowModal(
                          record.name,
                          record.datum,
                          record.season,
                          image
                        );
                        setShowModal(true);
                      }}
                    >
                      Withdraw
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        setStakeDataAndShowModal(
                          record.name,
                          record.datum,
                          record.season,
                          image
                        )
                      }
                    >
                      Stake
                    </button>
                  )}
                </div>
              </div>
            );
          });
          // console.log(rows);
          setTotalStakedNFT(countStaked);
          setTotalReward(Number(countReward).toFixed(2));
          if (rows.length == 0) {
            rows = [
              <div className="table__main-row" key={0}>
                <div id="noRecordExistsDiv">
                  <p id="noRecordExists">No record exists!!</p>
                </div>
              </div>,
            ];
          }
          setTableRows(rows);
        }
      }

      setShowAddressModal(false);
      toast.success("Fetched sucessfully!");
    } catch (e) {
      console.error(e);
    }
  };

  const setStakeDataAndShowModal = async (
    name: any,
    datum: any,

    season: any,
    image: any
  ) => {
    try {
      if (window.cardano != undefined) {
        const promise = await window.cardano.enable(); //allow Nami to be accessible by this application
        const address = await window.cardano.getUsedAddresses(); //get nami wallet addresses
        let walletAddress = Cardano.Address.from_bytes(
          fromHex(address[0])
        ).to_bech32(); //get wallet address in bench32 alphabet
        setStakeNFTWalletaddress(walletAddress); //setting value
      } else {
        toast.error(
          "Nami extension is not found in browser! Check if it is installed"
        );
      }
      setDisplayErrorMsg(false);
      setStakeNFTName(name);

      setDatum(datum);
      setStakeNFTSeason(season);
      setStakeNFTImage(image);
      setShowStakeModal(true);
    } catch (ex) {
      console.error(ex);
    }
  };
  const setUnStakeDataAndShowModal = async (
    name: any,
    datum: any,

    season: any,
    image: any
  ) => {
    try {
      if (window.cardano != undefined) {
        const promise = await window.cardano.enable(); //allow Nami to be accessible by this application
        const address = await window.cardano.getUsedAddresses(); //get nami wallet addresses
        let walletAddress = Cardano.Address.from_bytes(
          fromHex(address[0])
        ).to_bech32(); //get wallet address in bench32 alphabet
        setStakeNFTWalletaddress(walletAddress); //setting value
      } else {
        toast.error(
          "Nami extension is not found in browser! Check if it is installed"
        );
      }
      setDisplayErrorMsg(false);
      setStakeNFTName(name);

      setDatum(datum);
      setStakeNFTSeason(season);
      setStakeNFTImage(image);
    } catch (ex) {
      console.error(ex);
    }
  };

  /***Stake Limit Radio Button */
  const [selectedStakeLimit, setSelectedStakeLimit] = useState<String>();

  // This function will be triggered when a radio button is selected
  const radioHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedStakeLimit(event.target.value);
  };
  let [displayErrorMsg, setDisplayErrorMsg] = useState(false);

  const stakeNFT = async (StakeNFTName: String) => {
    try {
      console.log("Staking :", StakeNFTName);
      setDisplayErrorMsg(false);
      if (selectedStakeLimit === undefined || selectedStakeLimit === "") {
        setDisplayErrorMsg(true);
      } else {
        if (window.cardano != undefined) {
          const promise = await window.cardano.enable(); //allow Nami to be accessible by this application
          const address = await window.cardano.getUsedAddresses(); //get nami wallet addresses
          let collateral = await window.cardano.getCollateral();

          let walletAddress = Cardano.Address.from_bytes(fromHex(address[0]));
          console.log(
            "NETWORK ID",
            await window.cardano.getNetworkId(),
            walletAddress.to_bech32()
          );

          let datum = {
            tn: toHex(StakeNFTName),
            cs: Policy,
            beneficiary: `${toHex(
              Cardano.BaseAddress.from_address(walletAddress)
                ?.payment_cred()
                .to_keyhash()
                ?.to_bytes()
            )}`,
            deadline: `${selectedStakeLimit}`,
          };
          console.log("SADasda", datum);

          let listAssetQuery = {
            query: `mutation {
          ListAsset(
            listAssetInput: {
              datum: {
                tn: "${datum.tn}",
                cs: "${datum.cs}",
                beneficiary: "${datum.beneficiary}",
                deadline: "${datum.deadline}"
              },
              seller: {
                address: "${walletAddress.to_bech32()}"
              },
              colletral_utxos: ${JSON.stringify(collateral)}
            }
          )  {
            datumHash
            tx
            }
          }`,
          };

          axios
            .post(appHost + "/ListAsset", listAssetQuery)
            .then(async (res) => {
              if (res.data.errors !== undefined) {
                let error = res.data.errors[0].message;
                if (
                  res.data.errors[0].message.includes(
                    "Cannot return null for non-nullable field Mutation.ListAsset."
                  )
                ) {
                  toast.error("Unknown error occured kindly try again.");
                } else if (error === "UTxO Balance Insufficient") {
                  toast.error(
                    "Transaction cannot be done you don't have sufficient balance in your wallet."
                  );
                } else if (
                  error ===
                  "TypeError: Cannot read properties of null (reading 'forEach')"
                ) {
                  toast.error("Add collateral in order to stake the token.");
                } else {
                  toast.error(res.data.errors[0].message);
                }
              } else {
                let datumHash = res.data.data.ListAsset.datumHash;
                let tx = res.data.data.ListAsset.tx;
                let ret = await finalizeTxBack(res.data.data.ListAsset.tx);

                let date = new Date();
                let stakeEndDate = new Date();
                if (selectedStakeLimit === "oneMonth") {
                  stakeEndDate.setDate(stakeEndDate.getDate() + 30);
                } else {
                  stakeEndDate.setDate(stakeEndDate.getDate() + 365);
                }
                let stakeEndDateISO = stakeEndDate.toISOString();

                let setStakingDetailsQuery = {
                  query: `mutation {
                  setStakingDetail(name: "${stakeNFTName}", date: "${date}", season: "${stakeNFTSeason}", walletaddress: "${stakeNFTWalletaddress}", stakeEndDate:"${stakeEndDateISO}", image:"${stakeNFTImage}", datumHash:"${datumHash}", tx:"${tx}", datum:{
                    tn: "${datum.tn}",
                    cs: "${datum.cs}",
                    beneficiary: "${datum.beneficiary}",
                    deadline: "${datum.deadline}"
                  }) 
                  {
                    name
                    date
                    season
                    walletaddress
                    stakeEndDate
                    datumHash
                    tx
                    datum {
                      tn
                      cs
                      beneficiary
                      deadline
                    }
                  }
                }`,
                };
                let response = await axios.post(
                  appHost + "/setStakingDetail",
                  setStakingDetailsQuery
                );
                fetchApes();
                setShowStakeModal(false);

                toast.success("Staking Successful!");
              }
            });
        } //get wallet address in bench32 alphabet
      }
    } catch (e) {
      console.error("Catched", e);
    }
  };

  return (
    <Flex>
      <StakingSideNav />
      <StyledStaking>
        <div className="gradient"> </div>
        <h1> Staking Dashboard </h1>
        <FancyButton onClick={handleShowAddressModal}>Fetch Apes</FancyButton>
        <div className="table">
          <div className="table__info">
            <button>YOUR APES </button>
            <h3> Daily Rewards: {totalReward} </h3>
            <h3> Staked Apes: {totalStakedNFT} </h3>
          </div>
          <div className="table__main">
            <div className="table__main-header">
              {/* <h4></h4> */}
              <h4> ID </h4>
              <h4> Ape Name </h4>
              <h4> Ape Rarity </h4>
              <h4> Daily Reward </h4>
              <h4> Staking Status </h4>
              <h4> Action </h4>
            </div>
            <div className="table__main-body">
              {tableRows != undefined && tableRows.length > 0 ? (
                tableRows
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
        {showModal && (
          <Modal>
            <div className="box">
              <button className="close" onClick={() => setShowModal(false)}>
                <MdClose />
              </button>
              <h3> Modal Message </h3>
              <p>You have Not reached your staking deadline Yet !</p>
              <div className="action">
                <FancyButton
                  onClick={async () => {
                    const promise = await window.cardano.enable(); //allow Nami to be accessible by this application
                    const address = await window.cardano.getUsedAddresses();
                    let walletAddress = Cardano.Address.from_bytes(
                      fromHex(address[0])
                    );
                    console.log("Datum", Datum);

                    const assetUtxo = await getLockedUtxosByAsset(
                      contract.address,
                      Datum.cs + Datum.tn
                    );

                    setShowModal(false);
                    // await buildRedeemTokenFromPlutusScript(
                    //   Datum,
                    //   assetUtxo,
                    //   DatumHash
                    // );
                    await unStakeNFT(Datum, assetUtxo);
                    toast.success("Staking Successful!");
                  }}
                >
                  Proceed
                </FancyButton>
              </div>
            </div>
          </Modal>
        )}
        {showStakeModal && (
          <Modal>
            <div className="box">
              <button
                className="close"
                onClick={() => setShowStakeModal(false)}
              >
                <MdClose />
              </button>
              <h3> Stake </h3>
              <p>Are you sure, you want to stake this NFT ?</p>
              <br />
              <div>
                <>
                  <legend>Please select stake end date ? </legend>
                  <div id="radioDiv">
                    <input
                      type="radio"
                      name="stakeLimit"
                      value={
                        (Math.floor(new Date().getTime() / 1000.0) + 15778458) *
                        1000
                      }
                      id="OneMonth"
                      onChange={radioHandler}
                    />
                    <label htmlFor="OneMonth">&nbsp;&nbsp;Six Month </label>
                  </div>

                  <div id="radioDiv">
                    <input
                      type="radio"
                      name="stakeLimit"
                      value={
                        (Math.floor(new Date().getTime() / 1000.0) + 31556926) *
                        1000
                      }
                      id="OneYear"
                      onChange={radioHandler}
                    />
                    <label htmlFor="oneYear">&nbsp;&nbsp;One Year </label>
                  </div>
                </>
                {displayErrorMsg == true ? (
                  <p id="errorMsg"> Kindly select the stake end date first! </p>
                ) : (
                  <></>
                )}
              </div>

              <div className="action">
                <FancyButton
                  onClick={() => {
                    stakeNFT(stakeNFTName);
                  }}
                >
                  Proceed
                </FancyButton>
              </div>
            </div>
          </Modal>
        )}
        {showAddressModal && (
          <Modal>
            <div className="box">
              <button
                className="close"
                onClick={() => setShowAddressModal(false)}
              >
                <MdClose />
              </button>
              <h3> Wallet Address </h3>
              <p>
                Enter your wallet address:
                <input
                  id="inputField"
                  type="text"
                  defaultValue=""
                  onChange={handleAddressVal}
                  placeholder="Enter an amount here..."
                />
              </p>
              <div className="action">
                <FancyButton onClick={fetchApes}>Fetch</FancyButton>
              </div>
            </div>
          </Modal>
        )}
      </StyledStaking>
    </Flex>
  );
}

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 100;
  backdrop-filter: blur(10px);
  .box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #001114;
    padding: 2rem;
    border: 1px solid ${({ theme }) => theme.primary};
    border-radius: 1rem;
    width: 100%;
    max-width: 600px;
    max-height: 80vh;
    overflow: auto;
    p {
      margin: 1rem 0 0;
    }
    .action {
      margin: 1.5rem 0 0;
      button {
        padding: 0.5rem 1rem;
      }
    }
    .close {
      position: absolute;
      top: 2rem;
      right: 2rem;
      background: transparent;
      border: none;
      color: ${({ theme }) => theme.primary};
      font-size: 1.2rem;
      line-height: 1;
      cursor: pointer;
    }
  }
`;

const Flex = styled.main`
  padding: 12rem 2rem 4rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
  max-width: 1460px;
  margin: 0 auto;
`;

const StyledStaking = styled.section`
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

  .table {
    margin-top: 2rem;
    background-image: linear-gradient(90deg, #3468d1, rgba(52, 104, 210, 0.2));
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
        background-color: rgba(56, 152, 236, 0.1);
        color: #3468d1;
      }
    }
    &__main {
      padding: 0 2rem 1.5rem;
      border-radius: 0 0 50px 50px;
      background: #001114;
      &-header {
        padding: 2rem 0 0;
        display: grid;
        grid-template-columns: repeat(6, 1fr);
        margin-left: 94px;
        gap: 2rem;
        h4 {
          font-weight: normal;
          text-align: center;
        }
      }
      &-row {
        padding: 1rem 0 0;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        button {
          background: transparent;
          border: none;
          color: ${({ theme }) => theme.primary};
          cursor: pointer;
        }
        p {
          font-weight: normal;
          text-align: center;
          white-space: nowrap;
        }
        div {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          width: 100%;
          margin-left: 2rem;
          gap: 2rem;
          border: 1px solid hsla(0, 0%, 100%, 0.1);
          border-radius: 50px;
          font-size: 0.9rem;
          p {
            padding: 0.5rem 2rem;
            flex: 1;
            text-align: center;
            font-weight: bold;
          }
        }
      }
    }
  }
  #inputField {
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

  #radioDiv {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
    margin-left: 0.5rem;
  }

  #errorMsg {
    color: ${({ theme }) => theme.error};
    font-weight: bold;
  }

  #primarya {
    color: ${({ theme }) => theme.quaternary};
  }

  #tableRows {
    font-weight: normal;
  }

  #noRecordExists {
    flex: 1;
    text-align: center;
  }
  #noRecordExistsDiv {
    display: flex;
  }
  .avatar {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    box-shadow: 0 0 5px 4px rgb(0 0 0 / 25%);
    position: relative;
    img {
      object-fit: cover;
    }
  }
`;

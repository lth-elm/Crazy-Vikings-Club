import { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";

import opensea from "./assets/Opensea.png";

import { useAccount, useSigner } from "wagmi";
import { ethers } from "ethers";

import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";

import Dashboard from "./pages/Dashboard";
import NotConnected from "./components/NotConnected";

import vikingsAbi from "./abis/CrazyVikingsClub.json";
import shopAbi from "./abis/CrazyVikingsShop.json";

const vikingsContractABI = vikingsAbi.abi;
const shopContractABI = shopAbi.abi;

// >>>>>>>>>>> UPDATE THIS <<<<<<<<<<< //
const vikingsContractAddress = "0xA3202D542710D79499AE7C466F2148941E95B40d";
const shopContractAddress = "0x46ed417d3034603BB064F93723de67a7342AE702";

export default function Protocol() {
  const { isConnected } = useAccount();
  const { data: signer } = useSigner();

  const [vikingsContract, setVikingsContract] = useState();
  const [shopContract, setShopContract] = useState();

  const [totalSupply, setTotalSupply] = useState(10000);
  const [epicsThreshold, setEpicsThreshold] = useState(30);
  const [specialsThreshold, setSpecialsThreshold] = useState(400);

  const [levelOnePrice, setLevelOnePrice] = useState("383800000000000000");
  const [levelTwoPrice, setLevelTwoPrice] = useState("565000000000000000");
  const [levelThreePrice, setLevelThreePrice] = useState("677600000000000000");

  const [showDialog, setShowDialog] = useState(false);
  const [showSign, setShowSign] = useState(false);
  const [mined, setMined] = useState(false);
  const [transactionHash, setTransactionHash] = useState("");

  const openseaLink = "https://opensea.io/assets/bsc/0xa3202d542710d79499ae7c466f2148941e95b40d/";

  useEffect(() => {
    if (!signer) return;
    getContractData();
  }, [signer]);

  const getContractData = async () => {
    try {
      // ============= CRAZY VIKINGS CONTRACT =============
      const crazyVikingsContract = new ethers.Contract(vikingsContractAddress, vikingsContractABI, signer);
      const getTotalSupply = await crazyVikingsContract.totalSupply();

      setVikingsContract(crazyVikingsContract);
      setTotalSupply(getTotalSupply.toNumber());

      // ============== CRAZY SHOP CONTRACT ===============
      const crazyShopContract = new ethers.Contract(shopContractAddress, shopContractABI, signer);

      const getEpicsThreshold = await crazyShopContract.EPICS_THRESHOLD();
      const getSpecialsThreshold = await crazyShopContract.SPECIALS_THRESHOLD();

      const getLevelOnePrice = await crazyShopContract.priceLevelOne();
      const getLevelTwoPrice = await crazyShopContract.priceLevelTwo();
      const getLevelThreePrice = await crazyShopContract.priceLevelThree();

      setShopContract(crazyShopContract);
      setEpicsThreshold(getEpicsThreshold.toNumber());
      setSpecialsThreshold(getSpecialsThreshold.toNumber());
      setLevelOnePrice(getLevelOnePrice.toString());
      setLevelTwoPrice(getLevelTwoPrice.toString());
      setLevelThreePrice(getLevelThreePrice.toString());
    } catch (error) {
      console.log(error);
    }
  };

  function ConfirmDialog() {
    const handleClose = () => clearTransactionDialog();

    return (
      <Modal show={true} onHide={handleClose} backdrop="static" keyboard={false} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {mined && "Transaction Confirmed"}
            {!mined && !showSign && "Confirming Your Transaction..."}
            {!mined && showSign && "Please Sign to Confirm"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div style={{ textAlign: "left", padding: "0px 20px 20px 20px" }}>
            {mined && (
              <div>
                Your transaction has been confirmed and is on the blockchain.
                <br />
                <br />
                <a target="_blank" rel="noreferrer" href={`https://bscscan.com/tx/${transactionHash}`}>
                  View on Bscscan
                </a>
              </div>
            )}
            {!mined && !showSign && (
              <div>
                <p>Please wait while we confirm your transaction on the blockchain....</p>
              </div>
            )}
            {!mined && showSign && (
              <div>
                <p>Please sign to confirm your transaction.</p>
              </div>
            )}
          </div>
          <div style={{ textAlign: "center", paddingBottom: "30px" }}>
            {!mined && (
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            )}
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button className="CloseModal" variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  const clearTransactionDialog = () => {
    setShowDialog(false);
    setShowSign(false);
    setMined(false);
    setTransactionHash("");
  };

  return (
    <div className="Protocol">
      <NavBar />
      <a href={openseaLink} target="_blank" rel="noreferrer">
        <img src={opensea} width="2.5%" alt="Opensea logo" />
      </a>
      <div className="BodyProtocol">
        {isConnected ? (
          <Routes>
            <Route
              path="/"
              element={
                <Dashboard
                  totalSupply={totalSupply}
                  vikingsContract={vikingsContract}
                  shopContract={shopContract}
                  epicsThreshold={epicsThreshold}
                  specialsThreshold={specialsThreshold}
                  levelOnePrice={levelOnePrice}
                  levelTwoPrice={levelTwoPrice}
                  levelThreePrice={levelThreePrice}
                  getContractData={getContractData}
                  clearTransactionDialog={clearTransactionDialog}
                  setShowSign={setShowSign}
                  setShowDialog={setShowDialog}
                  setMined={setMined}
                  setTransactionHash={setTransactionHash}
                />
              }
            />
          </Routes>
        ) : (
          <NotConnected />
        )}

        {showDialog && <ConfirmDialog />}
      </div>
    </div>
  );
}

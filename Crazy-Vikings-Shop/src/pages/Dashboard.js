import { useState } from "react";

import { BsArrowLeftCircle, BsArrowRightCircle } from "react-icons/bs";

import { ethers } from "ethers";

import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

// import zero from "../assets/0.json";
import firstcommon from "../assets/400.json";
import opensea from "../assets/Opensea.png";
import bnb from "../assets/Gold-BNB-Logo.png";

export default function Dashboard(props) {
  const {
    totalSupply,
    vikingsContract,
    shopContract,
    epicsThreshold,
    specialsThreshold,
    levelOnePrice,
    levelTwoPrice,
    levelThreePrice,
    getContractData,
    clearTransactionDialog,
    setShowSign,
    setShowDialog,
    setMined,
    setTransactionHash,
  } = props;

  const [tokenId, setTokenId] = useState(400);
  const [metadata, setMetadata] = useState(firstcommon);
  const [isOwnerOfToken, setIsOwnerOfToken] = useState(true);

  // >>>>>>>>>>> UPDATE THIS <<<<<<<<<<< //
  const imgBaseUri =
    "https://peach-traditional-coral-989.mypinata.cloud/ipfs/bafybeifvhxnlhezba3rnprdb3l37ulmgjbncgmojmwqltxsrwf6kgtpb4m/";
  const dataBaseUri = "https://bafybeicqhrnawqrxwzjysu67v2aphqoxp55xhwuftzmct7uw6hirqypcwm.ipfs.nftstorage.link/";
  const openseaLink = "https://opensea.io/assets/bsc/0xa3202d542710d79499ae7c466f2148941e95b40d/";

  const incrementTokenId = async () => {
    const currentId = parseInt(tokenId);
    if (currentId >= totalSupply - 1) {
      alert("This is the last Viking!");
    } else {
      const nextId = currentId + 1;
      setTokenId(nextId);
      getData(nextId);
    }
  };

  const decrementTokenId = async () => {
    const currentId = parseInt(tokenId);
    if (currentId > 0) {
      const previousId = currentId - 1;
      setTokenId(previousId);
      getData(previousId);
    } else {
      return;
    }
  };

  const updateTokenId = async (id) => {
    if (id >= 0 && id < totalSupply) {
      setTokenId(id);
      getData(id);
    } else {
      return;
    }
  };

  const getData = async (id) => {
    getJson(id);
    try {
      const ownerOfToken = await vikingsContract.ownerOf(id);
      setIsOwnerOfToken(ownerOfToken === shopContract.address);
    } catch (error) {
      console.log(error);
    }
  };

  const getJson = async (id) => {
    const response = await fetch(dataBaseUri + id);
    const data = await response.json();
    setMetadata(data);
  };

  const purchaseToken = async (price) => {
    console.log("Acquiring Crazy Viking #", tokenId);

    setShowSign(true);
    setShowDialog(true);
    setMined(false);

    try {
      const override = {
        value: price,
      };
      let transaction = await shopContract.purchase(tokenId, override);

      setShowSign(false);

      await transaction.wait();

      setMined(true);
      setTransactionHash(transaction.hash);
      console.log("Successfully acquired, transaction hash:", transaction.hash);

      await getContractData();
    } catch (error) {
      console.log(error);
      clearTransactionDialog();
    }
  };

  const PurchaseButton = () => {
    const price =
      tokenId < epicsThreshold ? levelThreePrice : tokenId < specialsThreshold ? levelTwoPrice : levelOnePrice;

    const displayPrice = ethers.utils.formatEther(price);

    return (
      <div>
        <Button variant="custom" onClick={() => purchaseToken(price)}>
          Get it for {displayPrice} BNB &nbsp; <img src={bnb} width="6%" alt="BNB logo" />
        </Button>
      </div>
    );
  };

  return (
    <div>
      <div className="dashboard">
        <div className="RarityLevels">
          <p> Rarity levels :</p>
          <p>
            0 {"≤"} Epics {"<"} 30{" "}
          </p>
          <p>
            30 {"≤"} Specials {"<"} 400
          </p>
          <p>
            400+ {"≤"} Commons {"<"} {totalSupply}
          </p>
        </div>
        <div className="DisplayNFT">
          <div className="DivVikingImg">
            <img className="VikingImg" src={imgBaseUri + tokenId + ".png"} alt="Viking NFT" />
          </div>
          <div>
            <h2 className="h2VikingName">{metadata && metadata.name}</h2>

            <Row xs={1} md={2} className="g-4">
              {metadata &&
                metadata.attributes.map((attributes) => {
                  return (
                    <div className="vikingdata" /*key={metadata.id}*/>
                      <span className="text">{attributes.trait_type}</span>
                      <br />
                      {attributes.value}
                      <br />
                      <br />
                    </div>
                  );
                })}
            </Row>
          </div>
        </div>

        <br />
        <hr />
        <br />

        <div className="NavigateAndBuy">
          <div className="navigate">
            <div></div>
            <div className="leftButton">
              {tokenId > 0 ? (
                <Button variant="custom" onClick={() => decrementTokenId()}>
                  <BsArrowLeftCircle />
                </Button>
              ) : (
                <Button variant="custom" disabled>
                  <BsArrowLeftCircle />
                </Button>
              )}
            </div>

            <div>
              <InputGroup className="mb-3 ">
                <Form.Control
                  className="text-center InputPadding"
                  type="number"
                  step="1"
                  min="0"
                  max={totalSupply - 1}
                  value={tokenId}
                  aria-label="tokenid"
                  aria-describedby="basic-addon1"
                  onChange={(e) => updateTokenId(e.target.value)}
                />
              </InputGroup>
            </div>

            <div className="rightButton">
              {tokenId < totalSupply - 1 ? (
                <Button variant="custom" onClick={() => incrementTokenId()}>
                  <BsArrowRightCircle />
                </Button>
              ) : (
                <Button variant="custom" disabled>
                  <BsArrowRightCircle />
                </Button>
              )}
            </div>
            <div></div>
          </div>
          <div className="purchase">
            {isOwnerOfToken ? (
              <PurchaseButton />
            ) : (
              <a href={openseaLink + tokenId} target="_blank" rel="noreferrer">
                <Button variant="custom">
                  See on Opensea &nbsp; <img src={opensea} width="7%" alt="Opensea logo" />
                </Button>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import { Button } from "react-bootstrap";
import { setupUserTx } from "../cadence/transactions/setup_user.js";
import { setupVaultTx } from "../cadence/transactions/create_vault.js";
import * as fcl from "@onflow/fcl";
import Collection from "../Collection.js";
import { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { checkVaultTx } from "../cadence/scripts/check_vault";
import { checkCollectionTx } from "../cadence/scripts/check_collection";
import { getNFTsScript } from "../cadence/scripts/get_nfts.js";
import { getSaleNFTsScript } from "../cadence/scripts/get_sale_nfts";
import Card from "../Components/cards";

function AlwaysOpenExample() {
  const [User, setUser] = useState("");
  const [value, setValue] = useState(false);

  console.log("toggle", value);

  useEffect(() => {
    fcl.currentUser().subscribe((res) => {
      setUser(res);
      console.log("userff", res.loggedIn);
    });
  }, []);

  const [address, setAddress] = useState();
  const [officialAddress, setOfficialAddress] = useState("");
  const [trigger, settrigger] = useState(false);

  // const [TxStatus, setTxStatus] = useState("")

  const setupUser = async () => {
    const transactionId = await fcl.mutate({
      cadence: setupUserTx,
      args: (arg, t) => [],
      payer: fcl.authz,
      proposer: fcl.authz,
      authorizations: [fcl.authz],
      limit: 999,
    });
    console.log(transactionId);
    // fcl.tx(transactionId).subscribe(setTxStatus);
    var response = await fcl.tx(transactionId).onceSealed();
    console.log("response", response);
    alert("Congratulation, Your collection is successfully created");
  };

  const setupVault = async () => {
    const transactionId = await fcl.mutate({
      cadence: setupVaultTx,
      args: (arg, t) => [],
      payer: fcl.authz,
      proposer: fcl.authz,
      authorizations: [fcl.authz],
      limit: 999,
    });
    console.log(transactionId);
    // fcl.tx(transactionId).subscribe(setTxStatus);
    var response = await fcl.tx(transactionId).onceSealed();
    console.log("response", response);
    alert("Congratulation, Your Token Vault successfully created");
  };

  const [VStatus, setVStatus] = useState(true);
  const [CStatus, setCStatus] = useState(true);
  const VaultStatus = async () => {
    if (User.loggedIn)
      try {
        const result = await fcl.query({
          cadence: checkVaultTx,
          args: (arg, t) => [arg(User?.addr, t.Address)],
        });
        console.log(result);
        setVStatus(result);
      } catch (error) {
        console.log("error", error);
      }
  };

  const CollectionStatus = async () => {
    if (User.loggedIn)
      try {
        const result = await fcl.query({
          cadence: checkCollectionTx,
          args: (arg, t) => [arg(User.addr, t.Address)],
        });
        console.log(result);
        setCStatus(result);
      } catch (error) {
        console.log("error", error);
      }
  };

  useEffect(() => {
    if (User?.addr) {
      VaultStatus();
      CollectionStatus();
    }
  }, [User]);

  const [nftData, setnftData] = useState({});
  const [salenfts, setsalenfts] = useState({});

  const getnftData = async (address) => {
    try {
      const result = await fcl.query({
        cadence: getNFTsScript,
        args: (arg, t) => [arg(address, t.Address)],
      });
      console.log("minted NFT", result);
      setnftData({ ...nftData, [address]: result });
    } catch (error) {
      console.log("error", error);
    }
  };

  const getUserSaleNFTs = async (address) => {
    try {
      const result = await fcl.query({
        cadence: getSaleNFTsScript,
        args: (arg, t) => [arg(address, t.Address)],
      });
      console.log("listedNFT", result);
      setsalenfts({ ...salenfts, [address]: result });
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    getnftData(address);
    getUserSaleNFTs(address);
  }, [value]);

  console.log("allNftData", salenfts);

  return (
    <div className="">
      {CStatus ? null : (
        <Button
          variant="success"
          className="container my-2"
          style={{ "max-width": "38%", "margin-left": "30%" }}
          onClick={() => setupUser()}
        >
          Setup Collection
        </Button>
      )}
      {VStatus ? null : (
        <Button
          variant="success"
          className="container"
          style={{ "max-width": "38%", "margin-left": "30%" }}
          onClick={() => setupVault()}
        >
          Setup Vault
        </Button>
      )}
      <Form className="d-flex container my-2" style={{ "max-width": "64%" }}>
        <Form.Control
          type="search"
          placeholder="Enter Account Address"
          className="me-2"
          aria-label="Search"
          // value={address.trim()}
          onChange={(e) => {
            setAddress(e.target.value);
            settrigger(false);
          }}
        />
        <Button
          variant="outline-success"
          onClick={() => {
            setOfficialAddress(address);
            settrigger(true);
            setValue(!value);
          }}
        >
          Search
        </Button>
      </Form>
      {/* {trigger && officialAddress && officialAddress !== "" ? (
        <Collection address={officialAddress}></Collection>
      ) : null} */}
      <h2 className="text-center my-3">Minted NFT</h2>
      <div
        className="container"
        style={{ display: "flex", "flex-wrap": "wrap" }}
      >
        {Object.entries(nftData).map(
          ([key, value]) =>
            salenfts[key] &&
            value &&
            value.map((nft) => (
              <div className="mx-1 my-2">
                {console.log("check", salenfts[key])}
                <Card nftData={nft} data={salenfts[key]} address={key} />
              </div>
            ))
        )}
      </div>
    </div>
  );
}

export default AlwaysOpenExample;

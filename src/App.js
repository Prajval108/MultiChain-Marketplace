import "bootstrap/dist/css/bootstrap.min.css";
// import logo from "./logo.svg";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import Alert from "react-bootstrap/Alert";
import Accordion from "./Components/Accordion";
import Cards from "./Components/cards";
import Navbar from "./Components/Navbars";
import Form from "./Components/form";
import Form1 from "./Components/form1";
import Signature from "./Components/generate_signature";
import Info from "./Components/Info";
import TransferToken from "./Components/TransferToken";
import { getCreatorScript } from "./cadence/scripts/get_owner";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
// import crypto from "crypto";

import * as fcl from "@onflow/fcl";
import { useState, useEffect } from "react";

const resolver = async () => {
  // const nonce = crypto.randomBytes(32).toString('hex');
  const nonce =
    "9a94bfb7c6ec45b87867fe30b989cf0ba87c0cd00f7040fd2ebd036cbedd7269";

  // const response = await fetch('/api/generate');
  return {
    appIdentifier: "Sapidblue",
    nonce,
  };
};

fcl.config({
  "app.detail.title": "Flow NFT Marketplace",
  "app.detail.icon": "https://i.ibb.co/j3ccDcv/image-removebg-preview.png",
  "accessNode.api": "https://rest-testnet.onflow.org", // Mainnet: "https://rest-mainnet.onflow.org"
  "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn", // Mainnet: "https://fcl-discovery.onflow.org/authn",
  "fcl.accountProof.resolver": resolver,
  "flow.network": "testnet",
  "0xProfile": "0xb7edc0f0ea3fbf8c",
});

function App() {
  const [user, setUser] = useState();

  useEffect(() => {
    // sets the `user` variable to the person that is logged in through Blocto
    fcl.currentUser().subscribe((res) => {
      setUser(res);
      console.log("userInfo", res);
    });
  }, []);

  // const accountProofService = user?.services?.find(services => services?.type === 'account-proof' );
  // console.log("proof", JSON.stringify(accountProofService?.data))

  let accountProofService = {
    f_type: "account-proof",
    f_vsn: "2.0.0",
    address: "0x342967d90036e986",
    nonce: "171064cb3b2e8f8b2625dfecd63a3ff8497b1f37ff149626838645f079fff339",
    signatures: [
      {
        f_type: "CompositeSignature",
        f_vsn: "1.0.0",
        addr: "0x342967d90036e986",
        keyId: 0,
        signature:
          "12c4012370f3914d56130010904bcc812314e1ef470171b78604d6e5f9c08f0f7023d758b4b3ec563a4a8f747b4f7853ab67128a9b89a3257d372e4c0fe7bd39",
      },
    ],
  };

  const check = async () => {
    const verified = await fcl.AppUtils.verifyAccountProof(
      "Sapidblue",
      accountProofService
    );
    console.log("proof_check", verified);
  };

  fcl.events("Deposit").subscribe((event) => {
    console.log(event);
  });


  const getCreator = async () => {
    try {
      const result = await fcl.query({
        cadence: getCreatorScript,
        args: (arg, t) => [
          arg(2, t.UInt64),
          arg(user.addr, t.Address),
        ],
      });
      console.log("123 Creator", result);
      
    } catch (error) {
      console.log("123", error);
    }
  };

  // const data12 = async () => {
  //   const txStatus =await fcl.authz()
  //   const resolved= await txStatus.resolve();
  //   ;
  //   console.log("status", await resolved.signingFunction() );
  //   console.log("status", await fcl.authz(),);

  // };

  // useEffect(()=> {
  //   data12();
  // }, [])

  return (
    <Router>
      <Navbar
        title="NFT Marketplace"
        SearchBar={false}
        address={user}
        fixed="top"
      />
      <hr />
      <button onClick={()=> getCreator()}>check</button>
      <Routes>
        <Route path="/" element={<Accordion />} />
        <Route exact path="/home" element={<Cards />} />
        <Route exact path="/signature" element={<Signature />} />

        <Route exact path="/form" element={<Form />} />
        <Route exact path="/form1" element={<Form1 />} />
        <Route exact path="/info" element={<Info />} />
        <Route exact path="/transfer-token" element={<TransferToken />} />
      </Routes>
    </Router>
  );
}

export default App;

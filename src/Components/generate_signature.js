import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import * as fcl from "@onflow/fcl";
import { useState } from "react";
import { mintNFT } from "../cadence/transactions/mint_nft.js";
import { create as ipfsClient } from "ipfs-http-client";
import { Buffer } from "buffer";
import Spinner from "react-bootstrap/Spinner";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Transaction from "./TransactionBar";
import { useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Alert from "react-bootstrap/Alert";
import { Row } from "react-bootstrap";
import { checkVaultTx } from "../cadence/scripts/check_vault";
import { checkCollectionTx } from "../cadence/scripts/check_collection";

// import { useNavigate } from "react-router-dom";

function BasicExample() {
  const [Message, setMessage] = useState("");
  const [Sig, setSeg] = useState("");
  const signMessage = async (e) => {
    e.preventDefault();
    const MSG = Buffer.from(Message).toString("hex");
    try {
      const data = await fcl.currentUser.signUserMessage(MSG);
      setSeg(data[0]?.signature);
      console.log("signature", data);
      //   return await fcl.currentUser.signUserMessage(MSG);
    } catch (error) {
      console.log(error);
    }
  };

  const [User, setUser] = useState("")

  useEffect(() => {
    // sets the `user` variable to the person that is logged in through Blocto
    fcl.currentUser().subscribe((res) => {
      setUser(res);
      console.log("userff", res.addr)
    });
  }, []);

  const VaultStatus = async (address) => {
    try {
      const result = await fcl.query({
        cadence: checkVaultTx,
        args: (arg, t) => [arg(address, t.Address)],
      });
      console.log(result);
      alert(result)
    } catch (error) {
      console.log("error", error)
    }
  };

  const CollectionStatus = async (address) => {
    try {
      const result = await fcl.query({
        cadence: checkCollectionTx,
        args: (arg, t) => [arg(address, t.Address)],
      });
      console.log(result);
      alert(result)
    } catch (error) {
      console.log("error", error)
    }
  };

  return (
    <div className="">
      <h3 className="text-center mb-4 mt-4">Signature Generator</h3>
      <Form onSubmit={signMessage} className="">
        <Form.Group className="container mb-3 col-8" controlId="formBasicName">
          <Form.Label></Form.Label>
          <Form.Control
            type="text"
            as="textarea"
            rows={8}
            placeholder="Enter signature message"
            required
            onChange={(e) => setMessage(e.target.value)}
          />
          <Form.Text className="text-muted"></Form.Text>
        </Form.Group>

        <Button
          variant="primary"
          type="submit"
          className="col-1 container mb-2"
          style={{ "margin-left": "193px" }}
        >
          Generate
        </Button>
      </Form>
      <Row className="container" style={{"margin-left": "184px"}}>
      <Button variant="success" className="mx-2 my-1 col-2" onClick={()=> VaultStatus(User?.addr)}>Vault Check</Button>
      <Button variant="success" className="mx-2  my-1 col-2" onClick={()=> CollectionStatus(User?.addr)}>Collection Check</Button>
      </Row >
      {Sig ? (
        <Alert key="primary " variant="primary" className="mt-2 mb-4 container">
          {Sig}
        </Alert>
      ) : null}
    </div>
  );
}

export default BasicExample;

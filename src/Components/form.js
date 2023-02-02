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

// import { useNavigate } from "react-router-dom";

function BasicExample() {
  const notify = () =>
    toast.success("File successfully uploaded to IPFS!", {
      position: "top-center",
      autoClose: 5000,
      theme: "light",
    });

  const projectId = "2DOvbfvzvxiMrIR8zw5qgs4v2mF"; // <---------- your Infura Project ID
  const projectSecret = "4fb093a8defe6d6d25da8357d764d34a"; // <---------- your Infura Secret
  const auth =
    "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");

  const [nameOfNFT, setNameOfNFT] = useState([]);
  const [Attack, setAttack] = useState("");
  const [Defence, setDefence] = useState("");
  const [Speed, setSpeed] = useState("");
  const [Health, setHealth] = useState("");
  const [Quantity, setQuantity] = useState(1);
  const [Msg, setMsg] = useState("");
  const [fileUrl, updateFileUrl] = useState(``);
  const [Description, setDescription] = useState();

  const [txId, setTxId] = useState();
  const [txInProgress, setTxInProgress] = useState(false);
  const [txStatus, setTxStatus] = useState(-1);
  const [txStatusCode, setTxStatusCode] = useState(0);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const client = ipfsClient({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
    headers: {
      authorization: auth,
    },
  });

  // var onChange = async (resolve,reject,e)=>{
  //   const file = e.target.files[0]
  //   try {
  //     const added = await client.add(file)
  //     const url = `https://prajval.infura-ipfs.io/ipfs/${added.path}`
  //     updateFileUrl(url)
  //     console.log("success")
  //     resolve("File successfully uploaded to IPFS");
  //   } catch (error) {
  //     console.log('Error uploading file: ', error)
  //     reject("Uploading failed");
  //   }
  //   }

  const onChange = async (e) => {
    const file = e.target.files[0];
    try {
      const added = await client.add(file);
      const url = `https://prajval.infura-ipfs.io/ipfs/${added.path}`;
      updateFileUrl(url);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  };

  console.log("ipfs url", fileUrl);
  console.log("name", Array(nameOfNFT));

  const mint = async (e) => {
    e.preventDefault();
    setTxInProgress(true);
    setTxStatus(-1);
    handleShow();
    try {
      const transactionId = await fcl.mutate({
        cadence: mintNFT,
        args: (arg, t) => [
          arg(nameOfNFT, t.String),
          arg(Description, t.String),
          arg(fileUrl, t.String),
          arg("testendpoint.com", t.String),
          arg(Quantity, t.UInt64),
        ],
        payer: fcl.authz,
        proposer: fcl.authz,
        authorizations: [fcl.authz],
        limit: 999,
      });
      console.log(transactionId);

      setTxId(transactionId);
      fcl.tx(transactionId).subscribe((res) => {
        setTxStatus(res.status);
        setTxStatusCode(res.statusCode);
        console.log("response", res);
      });
    } catch (error) {
      console.log("Error minting", error);
      handleClose();
      setTxInProgress(false);
      alert(error);
    }
  };
  return (
    <div className="container">
      <h3 className="text-center mb-4 mt-4">NFT Minting</h3>
      <Form onSubmit={mint} className="container">
        <Form.Group className="container mb-3 col-8" controlId="formBasicName">
          <Form.Label>NFT name</Form.Label>
          <Form.Control
            type="text"
            placeholder="NFT name"
            required
            onChange={(e) => setNameOfNFT(e.target.value)}
          />
          <Form.Text className="text-muted"></Form.Text>
        </Form.Group>

        <Form.Group className="container mb-3 col-8" controlId="formBasicEmail">
          <Form.Label>File Upload</Form.Label>
          <Form.Control
            type="file"
            placeholder="Upload file"
            required
            onChange={onChange}
          />
          <Form.Text className="text-muted"></Form.Text>
        </Form.Group>

        {/* <div className="row center" style={{"margin-left": "183px"}}>
        <Form.Group className="mb-3 col-2" controlId="formBasicEmail">
          <Form.Label>Attack</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter attack"
            required
            onChange={(e) => setAttack(e.target.value)}
          />
          <Form.Text className="text-muted"></Form.Text>
        </Form.Group>

        <Form.Group className="mb-3 col-2" controlId="formBasicEmail">
          <Form.Label>Defence</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter defence"
            required
            onChange= {(e) => setDefence(e.target.value)}
          />
          <Form.Text className="text-muted"></Form.Text>
        </Form.Group>

        <Form.Group className="mb-3 col-2" controlId="formBasicEmail">
          <Form.Label>Speed</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter speed"
            required
            onChange= {(e) => setSpeed(e.target.value)}
          />
          <Form.Text className="text-muted"></Form.Text>
        </Form.Group>

        <Form.Group className="mb-3 col-2" controlId="formBasicEmail">
          <Form.Label>Health</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Health"
            required
            onChange= {(e) => setHealth(e.target.value)}
          />
          <Form.Text className="text-muted"></Form.Text>
        </Form.Group>
        </div> */}

        <Form.Group className="container mb-3 col-8" controlId="formBasicEmail">
          <Form.Label>Description</Form.Label>
          <Form.Control
            type="text"
            as="textarea"
            rows={5}
            placeholder="Enter the description"
            required
            onChange={(e) => setDescription(e.target.value)}
          />
          <Form.Text className="text-muted"></Form.Text>
        </Form.Group>

        <Form.Group className="container mb-3 col-8" controlId="formBasicEmail">
          <Form.Label>Quantity</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter Health"
            value={Quantity}
            required
            onChange={(e) => setQuantity(e.target.value)}
          />
          <Form.Text className="text-muted"></Form.Text>
        </Form.Group>

        <Button
          variant="primary"
          type="submit"
          className="col-1 container"
          style={{ "margin-left": "193px" }}
        >
          Mint
        </Button>
      </Form>
      {/* <Transaction txId={txId} txInProgress={txInProgress} txStatus={txStatus} txStatusCode={txStatusCode} /> */}

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>NFT Minting</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Transaction
            txId={txId}
            txInProgress={txInProgress}
            txStatus={txStatus}
            txStatusCode={txStatusCode}
          />
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </div>
  );
}

export default BasicExample;

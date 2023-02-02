import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import * as fcl from "@onflow/fcl";
import { useState } from "react";
import { transferTx } from "../cadence/transactions/transfer_token";
import { create as ipfsClient } from "ipfs-http-client";
import { Buffer } from "buffer";
import Spinner from "react-bootstrap/Spinner";
import { ToastContainer, toast } from "react-toastify";
import Transaction from "./TransactionBar";
import Modal from "react-bootstrap/Modal";

import "react-toastify/dist/ReactToastify.css";

// import { useNavigate } from "react-router-dom";

function BasicExample() {
  const [Receiver, setReceiver] = useState("");
  const [Amount, setAmount] = useState("");

  const [txId, setTxId] = useState();
  const [txInProgress, setTxInProgress] = useState(false);
  const [txStatus, setTxStatus] = useState(-1);
  const [txStatusCode, setTxStatusCode] = useState(0);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const transfer = async (e) => {
    e.preventDefault();
    setTxInProgress(true);
    setTxStatus(-1);
    handleShow();
    try {
      const amount = Number(Amount).toFixed(2)
      const transactionId = await fcl.mutate({
        cadence: transferTx,
        args: (arg, t) => [arg(Receiver, t.Address), arg(amount, t.UFix64)],
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
      const response = await fcl.tx(transactionId).onceSealed();
      console.log("sealed", response);
    } catch (error) {
      console.log("Error minting", error);
      setTxInProgress(false);
      alert(error);
      handleClose();
    }
  };

  return (
    <div className="container">
      <h3 className="text-center mb-4 mt-4">Transfer Token</h3>
      <Form onSubmit={transfer} className="container">
        <Form.Group className="container mb-3 col-8" controlId="formBasicName">
          <Form.Label>Receiver Account</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter the recipient account address"
            required
            onChange={(e) => setReceiver(e.target.value)}
          />
          <Form.Text className="text-muted"></Form.Text>
        </Form.Group>

        <Form.Group className="container mb-3 col-8" controlId="formBasicEmail">
          <Form.Label>Amount</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter amount in Rumble"
            required
            onChange={(e) => setAmount(e.target.value)}
          />
          <Form.Text className="text-muted"></Form.Text>
        </Form.Group>
        <Button
          variant="primary"
          type="submit"
          style={{ "margin-left": "193px" }}
        >
          Transfer
        </Button>
      </Form>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Rumble Tranfer</Modal.Title>
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

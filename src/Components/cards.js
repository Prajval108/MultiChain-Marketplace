import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
// import Modal from "./modal";
import Modal from "react-bootstrap/Modal";
import { useEffect, useState } from "react";
import * as fcl from "@onflow/fcl";
import { listForSaleTx } from "../cadence/transactions/list_for_sale.js";
import { bulkListingTx } from "../cadence/transactions/bulk_listing.js";
import { purchaseTx } from "../cadence/transactions/purchase.js";
import Transaction from "./TransactionBar";
import Form from "react-bootstrap/Form";

function BasicExample({ nftData, data, address }) {
  const [user, setUser] = useState();
  useEffect(() => {
    // sets the `user` variable to the person that is logged in through Blocto
    fcl.currentUser().subscribe((res) => {
      setUser(res);
      console.log("userInfo", res);
    });
  }, []);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [show1, setShow1] = useState(false);
  const handleClose1 = () => setShow1(false);
  const handleShow1 = () => setShow1(true);
  const [price, setPrice] = useState();

  const [txId, setTxId] = useState();
  const [txInProgress, setTxInProgress] = useState(false);
  const [txStatus, setTxStatus] = useState(-1);
  const [txStatusCode, setTxStatusCode] = useState(0);

  console.log("metadata", data);

  const listForSale = async (id) => {
    setTxInProgress(true);
    setTxStatus(-1);
    try {
      const amount = Number(price).toFixed(2);
      const transactionId = await fcl.mutate({
        cadence: listForSaleTx,
        args: (arg, t) => [arg(parseInt(id), t.UInt64), arg(amount, t.UFix64)],
        payer: fcl.authz,
        proposer: fcl.authz,
        authorizations: [fcl.authz],
        limit: 999,
      });
      console.log("Transaction ID", transactionId);

      setTxId(transactionId);
      fcl.tx(transactionId).subscribe((res) => {
        setTxStatus(res.status);
        setTxStatusCode(res.statusCode);
        console.log("error", res.errorMessage);
        console.log("response", res);
      });
    } catch (error) {
      setTxInProgress(false);
      console.log("error", error);
      alert(error);
    }
  };

  // const bulkListing = async () => {
  //   try {
  //     const transactionId = await fcl.mutate({
  //       cadence: bulkListingTx,
  //       args: (arg, t) => [arg(price, t.UFix64)],
  //       payer: fcl.authz,
  //       proposer: fcl.authz,
  //       authorizations: [fcl.authz],
  //       limit: 50,
  //     });
  //     console.log("Transaction ID", transactionId);
  //     var response = await fcl.tx(transactionId).onceSealed();
  //     console.log("response", response);
  //     setShow(false);
  //     alert("Congratulation, your NFT is successfully listed for selling");
  //     // fcl.tx(transactionId).subscribe(setTxStatus);
  //   } catch (error) {
  //     console.log("error", error);
  //     alert(error);
  //   }
  // };

  const purchase = async (id) => {
    setTxInProgress(true);
    setTxStatus(-1);
    handleShow1();
    try {
      const transactionId = await fcl.mutate({
        cadence: purchaseTx,
        args: (arg, t) => [
          arg("TTxnId", t.String),
          arg(address, t.Address),
          arg(parseInt(id), t.UInt64),
        ],
        payer: fcl.authz,
        proposer: fcl.authz,
        authorizations: [fcl.authz],
        limit: 999,
      });
      console.log("Transaction ID", transactionId);

      setTxId(transactionId);
      fcl.tx(transactionId).subscribe((res) => {
        setTxStatus(res.status);
        setTxStatusCode(res.statusCode);
        console.log("error", res.errorMessage);
        console.log("response", res);
      });
    } catch (error) {
      console.log("error in listin", error);
      handleClose1();
      setTxInProgress(false);
      alert(error);
    }
  };

  // fcl.events().on('transaction.authorized', (event) => {
  //   console.log("somethingTrigger")
  // })

  return (
    <div className="container col-sm-4">
      <Card
        border="success"
        style={{ "border-radius": "20px", width: "18rem" }}
      >
        <Card.Body>
          <Card.Img
            variant="top"
            src={nftData?.thumbnail}
            className="img-thumbnail"
            style={{ "border-radius": "20px", width: "400px", height: "150px" }}
          />

          <Card.Title className="text-center">{nftData?.name}</Card.Title>

          {/* <div className="row" style={{ color: "blue" }}>
            <div
              className="row"
              style={{ display: "flex", "flex-wrap": "wrap-reverse" }}
            >
              <Card.Text>Defence: {metadata.heroDefence}</Card.Text>

              <Card.Text>Attack: {metadata.heroAttack}</Card.Text>
            </div>

            <div
              className="row"
              style={{
                display: "flex",
                "flex-wrap": "wrap-reverse",
                position: "absolute",
                "text-align-last": "right",
              }}
            >
              <Card.Text>Health: {metadata.heroHealth}</Card.Text>

              <Card.Text>Speed: {metadata.heroSpeed}</Card.Text>
            </div>
          </div> */}

          {data[nftData?.id] ? (
            address !== user?.addr ? (
              <Button
                variant="success"
                onClick={() => purchase(nftData?.id)}
                className="center"
                style={{ "margin-left": "55px" }}
              >
                Buy @{Number(data[nftData?.id])} FLOW
              </Button>
            ) : (
              <Button
                disabled
                variant="success"
                className="center"
                style={{ "margin-left": "90px" }}
              >
                Owned
              </Button>
            )
          ) : address === user?.addr ? (
            <Button
              variant="warning"
              onClick={handleShow}
              style={{ "margin-left": "77px" }}
            >
              List for Sale
            </Button>
          ) : (
            <Button disabled variant="danger" style={{ "margin-left": "77px" }}>
              Not Listed
            </Button>
          )}
        </Card.Body>
        <Card.Title className="text-center" style={{ "font-size": "medium" }}>
          {address}
        </Card.Title>
      </Card>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>NFT Listing</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5 className="my-2" style={{ "padding-left": "18px" }}>
            Set price for selling NFT
          </h5>
          <Form className="d-flex container my-2">
            <Form.Control
              type="number"
              placeholder="Enter amount in Rumble"
              className="me-2"
              aria-label="Search"
              // value={address.trim()}
              onChange={(e) => setPrice(e.target.value)}
            />
            <Button
              variant="outline-success"
              onClick={() => {
                listForSale(nftData?.id);
              }}
            >
              Submit
            </Button>
          </Form>
          {/* <Button
              variant="outline-success"
              style={{"margin-left": "12px"}}
              onClick={() => {
                bulkListing();
              }}
            >
              Bulk Listing
            </Button> */}
          <Transaction
            txId={txId}
            txInProgress={txInProgress}
            txStatus={txStatus}
            txStatusCode={txStatusCode}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={show1} onHide={handleClose1}>
        <Modal.Header closeButton>
          <Modal.Title>NFT Purchase</Modal.Title>
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

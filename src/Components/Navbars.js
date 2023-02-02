import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useState } from "react";
import { Buffer } from 'buffer'
import PropTypes from "prop-types";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import * as fcl from "@onflow/fcl";
import { Link } from "react-router-dom";
import { getBalance } from "../cadence/scripts/get_balance";
import { getTokenBalance } from "../cadence/scripts/get_token_balance";
import { mintTokenTx } from "../cadence/transactions/mint_token";
import { accountInfoTx } from "../cadence/scripts/get_account_info";

import { useEffect } from "react";

var CronJob = require("cron").CronJob;

function NavScrollExample(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [Amount, setAmount] = useState(null);

  const [flow, setflow] = useState(0);
  const [balance, setbalance] = useState(0);

  const getUserFlow = async (address) => {
    try {
      const result = await fcl.query({
        cadence: getBalance,
        args: (arg, t) => [arg(address, t.Address)],
      });
      console.log(result);
      setflow(result);
    } catch (error) {
      // console.log("error", error)
    }
  };

  const getUserToken = async (address) => {
    try {
      const result = await fcl.query({
        cadence: getTokenBalance,
        args: (arg, t) => [arg(address, t.Address)],
      });
      console.log(result);
      setbalance(result);
    } catch (error) {
      // console.log("error", error)
    }
  };


  const logIn = () => {
    fcl.authenticate();
  };

  const minter = async (e) => {
    e.preventDefault();
    try {
      const amount = Number(Amount).toFixed(2)
      const transactionId = await fcl.mutate({
        cadence: mintTokenTx,
        args: (arg, t) => [arg(amount, t.UFix64)],
        payer: fcl.authz,
        proposer: fcl.authz,
        authorizations: [fcl.authz],
        limit: 999,
      });
      console.log(transactionId);
      var response = await fcl.tx(transactionId).onceSealed();
      console.log("response", response);
      alert("Congratulation, Newly Token successfully minted");
      // fcl.tx(transactionId).subscribe(setTxStatus);
    } catch (error) {
      console.log("Error minting", error);
      alert(error);
    }
  };

  
 
  console.log("balance", flow, balance);

  return (
    <Navbar bg="light" expand="lg">
      <Container fluid>
        <Link
          to={`/`}
          className="mx-2"
          style={{ textDecoration: "none", color: "black" }}
        >
          <h5 style={{ "padding-top": "10px", "font-size": "24px" }}>
            {props.title}
          </h5>
        </Link>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Toggle />

        <Nav
          className="me-auto my-2 my-lg-0"
          style={{ maxHeight: "100px" }}
          navbarScroll
        >
          <Link
            to={`/form`}
            className="mx-2"
            style={{
              textDecoration: "none",
              color: "black",
              "padding-top": "10px",
            }}
          >
            Create NFT
          </Link>
        </Nav>

        <Nav
          className="me-auto my-2 my-lg-0"
          style={{ maxHeight: "100px" }}
          navbarScroll
        >
          <Link
            to={`/transfer-token`}
            className="mx-2"
            style={{
              textDecoration: "none",
              color: "black",
              "padding-top": "10px",
            }}
          >
            Transfer Token
          </Link>

          <Link
            to={`/signature`}
            className="mx-2"
            style={{
              textDecoration: "none",
              color: "black",
              "padding-top": "10px",
            }}
          >
            Sign Generator
          </Link>
        </Nav>

        {/* <span style={{"color": "orange", 'padding-top': '10px'}}>Account1: 0xbec5f81a632081b1  Account2: 0xce22cec4a9d53379</span> */}

        <Navbar.Collapse className="justify-content-end">
          {props.address && props.address.addr ? (
            <Navbar.Text className="mx-2">
              <button onClick={getUserFlow(props.address.addr)} hidden></button>
              <button
                onClick={getUserToken(props.address.addr)}
                hidden
              ></button>
              Token: <a style={{ color: "blue" }}>{Number(balance)} Rumble</a>
              <a> </a>
              Balance: <a style={{ color: "blue" }}>{Number(flow).toFixed(2)} FLOW</a>
              <a> </a>
              Address: <a style={{ color: "blue" }}>{props.address.addr}</a>
            </Navbar.Text>
          ) : null}
          {props.address && props.address.addr ? (
            <Button
              type="submit"
              className="mx-1"
              onClick={() => fcl.unauthenticate()}
            >
              LogOut{" "}
            </Button>
          ) : (
            <Button type="submit" className="mx-1" onClick={() => logIn()}>
              Login{" "}
            </Button>
          )}
          {props?.address?.addr === "0x342967d90036e986" ? (
            <Button type="submit" onClick={handleShow}>
              Mint Token{" "}
            </Button>
      
          ) : null}
          {/* <Button onClick={()=> CollectionStatus(props.address.addr)}> Status</Button> */}
        </Navbar.Collapse>
      </Container>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Token Minting</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5 className="my-2" style={{ "padding-left": "18px" }}>
            Amount you want to mint!!
          </h5>
          <Form className="d-flex container my-2" onSubmit={minter}>
            <Form.Control
              type="search"
              placeholder="Enter amount"
              className="me-2"
              aria-label="Search"
              // value={address.trim()}
              onChange={(e) => setAmount(e.target.value)}
            />
            <Button variant="outline-success" type="submit">
              Submit
            </Button>
            
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

    </Navbar>
  );
}

NavScrollExample.defaultProps = {
  title: "your title",
  SearchBar: true,
};

NavScrollExample.propTypes = {
  title: PropTypes.string,
  SearchBar: PropTypes.bool,
};

export default NavScrollExample;

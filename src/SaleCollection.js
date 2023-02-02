import './App.css';

import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";
import {useState, useEffect} from 'react';
import {getSaleNFTsScript} from "./cadence/scripts/get_sale_nfts";
import {purchaseTx} from "./cadence/transactions/purchase.js";
import Card from "./components/cards";


function SaleCollection(props) {
  const [nfts, setNFTs] = useState([]);

  useEffect(() => {
    getUserSaleNFTs();
  }, [])

  const getUserSaleNFTs = async () => {

    const result = await fcl.query({
      cadence: getSaleNFTsScript,
      args: (arg, t) => [
        arg(props.address, t.Address)
      ],
    });
      console.log("sfd", result);
      setNFTs(result);
  }

  const purchase = async (id) => {
    const transactionId = await fcl.mutate({
      cadence: purchaseTx,
      args: (arg, t) => [
        arg(props.address, t.Address),
        arg(parseInt(id), t.UInt64)
      ],
      payer:fcl.authz,
      proposer:fcl.authz,
      authorizations:[fcl.authz],
      limit: 50
    })
      console.log(transactionId);
      return fcl.tx(transactionId).onceSealed();
  }
 
  return (

      <div>
        <h2 className='my-3'>Listed for Selling</h2>
        <button onClick={() => purchase(0)}>Purchase this NFT</button>
      {/* {Object.keys(nfts).map(price => (
            // <Card nftId={nfts[price].id} name={nfts[price].metadata.name} hash={nfts[price].ipfsHash} price={price}/>

          <div key={price}>
              <h2>ID: {nfts[price].id}</h2>
              <h2>Name: {nfts[price].metadata.name}</h2>
              <h2>Hash: {nfts[price].ipfsHash}</h2>
              <h2>Price: {price}</h2>
            <button onClick={() => purchase(price)}>Purchase this NFT</button>
            </div>
      ))} */}
    </div>
  );
}

export default SaleCollection;
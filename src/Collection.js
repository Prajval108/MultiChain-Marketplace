import "./App.css";

import * as fcl from "@onflow/fcl";
// import * as t from "@onflow/types";
import { useState, useEffect } from "react";
  import { getNFTsScript } from "./cadence/scripts/get_nfts.js";
import { getSaleNFTsScript } from "./cadence/scripts/get_sale_nfts";
import Card from "./Components/cards";

function Collection(props) {
  const [nfts, setNFTs] = useState([]);
  const [Data, setData] = useState({});
  const [salenfts, setsalenfts] = useState([]);

  useEffect(() => {
    getUserNFTs();
    getUserSaleNFTs();
  }, []);

  // useEffect(()=> {
  //   getData(0x342967d90036e986)
  // }, [])

  // const getData = async (address) => {
  //   try {
  //     const result = await fcl.query({
  //       cadence: getNFTsScript,
  //       args: (arg, t) => [arg(address, t.Address)],
  //     });
  //     console.log("minted NFT", result);
  //     setData({[address]: result});
  //   } catch (error) {
  //     console.log("error", error);
  //   }
  // };

  const getUserNFTs = async () => {
    try {
      const result = await fcl.query({
        cadence: getNFTsScript,
        args: (arg, t) => [arg(props.address, t.Address)],
      });
      console.log("minted NFT", result);
      setData({...Data,
        [props?.address]: result});
      setNFTs(result);
    } catch (error) {
      console.log("error", error);
    }
  };

  const getUserSaleNFTs = async () => {
    try {
      const result = await fcl.query({
        cadence: getSaleNFTsScript,
        args: (arg, t) => [arg(props.address, t.Address)],
      });
      console.log("listedNFT", result);
      setsalenfts(result);
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <>
      <h2 className="text-center my-3">Minted NFT</h2>
      <div
        className="container"
        style={{ display: "flex", "flex-wrap": "wrap" }}
      >
        {nfts &&
          nfts.map((nft) => (
            <div className="mx-1 my-2">
              {/* {console.log("hi", (nft))} */}
              <Card nftData={nft} data={salenfts} address={props.address} />
            </div>
          ))}
      </div>
    </>
  );
}

export default Collection;

import * as fcl from "@onflow/fcl";
import { updateAccount } from "../../store/user/Account";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { ethers } from "ethers";



function WalletConnect(data) {
    const dispatch = useDispatch();

    switch(data) {
        case "ethereum":
          connectMetamask()
          break;
        case "flow":
          connectBlocto();
          break;
        default:
          console.log(`Ooops, You dont have ${data} wallet`)
      }
    
    const connectMetamask= async()=> {
    console.log("metamask func");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    console.log(accounts[0]);
    dispatch(updateAccount(accounts[0]));

    window.ethereum.on("accountsChanged", async function (acc) {
      console.log('changed123 ',acc, acc.length)
      if(acc.length == 0){
        console.log('length is 0')
        dispatch(updateAccount(null));
      }else{
        console.log('length is not 0', acc.length)
        dispatch(updateAccount(acc[0]));
      }
    })
    axios.post(`${process.env.REACT_APP_DOMAIN}/addWallet`,{address:accounts[0],user_id:localStorage.getItem('user_id')},
    {
      headers:{
        userid : localStorage.getItem('user_id'),
        token : localStorage.getItem('Token')
      }
    })
    .then((res)=>{
      console.log('wallet storing')
      console.log(res)
    })
    }

    const connectBlocto = ()=> {
        fcl.authenticate();
    }

}

export default WalletConnect;
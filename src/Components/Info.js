import { useEffect, useState } from "react";
import Axios from "axios";
import Card from './cards'
// import Tables from "./Tables"


function Info() {

const [data, setdata] = useState("");

const info = () => {
    Axios.get(`http://localhost:4000/Bids_Info`).then((response) => {
    //   console.log(response.data);
      setdata(response.data);
    });
  };

  useEffect(()=>{
    info();
  },[])

  return (
    <div className= "container">
          { data && data.map((val, key) => {
            return (
                <div>
                  {/* <h5>itemId: {val.itemId}</h5>
                  <h5>Name: {val.Name}</h5>
                  <h5>Email: {val.Email}</h5>
                  <h5>Password: {val.Password}</h5>
                  <hr/> */}
                  {/* <Tables itemId={val.itemId} name={val.Name} email={val.Email}/> */}
                  <Card itemId={val.itemId} name={val.Name} email={val.Email}/>
                </div>
            );
          })}
        </div>
  )
    }
  export default Info;

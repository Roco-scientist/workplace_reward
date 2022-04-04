import { SwapContract } from "./Common";
import { useEthers } from "@usedapp/core";
import { constants } from "ethers";
import { Event } from "@ethersproject/contracts";
// import Web3 from 'web3';
import { useState } from "react";
import swap from "../Swap.json";

interface ComplimentLogs {
_from: string,
_to: string,
_amount: number,
_message: number,
}

export const Compliments = () => {
  // const { account } = useEthers();
  // const accountAddress = account ? account : constants.AddressZero;
  // const swapContract = SwapContract();
  // const filterCompliment = swapContract.filters.Sent(accountAddress);
  // swapContract
  //   .queryFilter(filterCompliment, -10, "latest")
  //   .then((events) => console.log(events));
  // const emptyEvents: Event[] = [];
  // const [complimentsTo, setComplimentsTo] = useState(emptyEvents);
  // const [complimentsFrom, setComplimentsFrom] = useState(emptyEvents);
  // console.log(complimentsTo);
  // const web3 = new Web3('wss://mainnet.infura.io/ws/v3/' + infura_token);
  // if (account) {
  //   const contract = new web3.eth.Contract(swap["abi"], swapContract.address);
  //   const pastEvents = contract.getPastEvents("Sent");
  //   console.log(pastEvents);
  //   // const filterComplimentFrom = swapContract.filters.Sent(
  //   //   accountAddress,
  //   //   null
  //   // );
  //   // console.log("From Me");
  //   // console.log(filterComplimentFrom);
  //   // const filterComplimentTo = swapContract.filters.Sent(null, accountAddress);
  //   // console.log("To me");
  //   // console.log(filterComplimentTo);
  //   // const logfrom = await swapContract.queryFilter(filterComplimentFrom);
  //   // if (filterComplimentFrom) {
  //   //   swapContract.queryFilter(filterComplimentFrom, -1).then((events) => {
  //   //     if (events) {
  //   //       setComplimentsFrom(events);
  //   //     }
  //   //   });
  //   // }
  //   // if (filterComplimentTo) {
  //   //   swapContract
  //   //     .queryFilter(filterComplimentTo, 0, "latest")
  //   //     .then((events) => setComplimentsTo(events));
  //   // }
  // }

  // console.log("Compliments to:");
  // console.log(complimentsTo);
  // console.log("Compliments From:");
  // console.log(complimentsFrom);
  // setup addresses to be used later.

  // let options = {
  //   filter: {
  //       value: ['1000', '1337']    //Only get events where transfer value was 1000 or 1337
  //   },
  //   fromBlock: 0,                  //Number || "earliest" || "pending" || "latest"
  //   toBlock: 'latest'
  // };

  // swapContract.getPastEvents('Send', options)
  //     .then(results => console.log(results))
  // .catch(err => throw err);
};

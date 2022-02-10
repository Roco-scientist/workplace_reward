import { useEthers } from "@usedapp/core";
import { Contract } from "@ethersproject/contracts";
import networkMapping from "../contract_map.json";
import { constants } from "ethers";
import swap from "../Swap.json";

// Styles for the header box
export const BoxHeaderStyle = {
  p: 2,
  fontSize: "h1.fontsize",
  fontWeight: "bold",
  textAlign: "center",
  backgroundColor: "primary.dark",
  color: "white",
  borderTopLeftRadius: 8,
  borderTopRightRadius: 8,
};

// Styles for the larger box container
export const BoxContainerStyle = {
  boxShadow: 3,
  backgroundColor: "#e3f2fd",
  borderRadius: 2,
  marginTop: 2,
};

export const SwapContract = () => {
  // set deploy number from the brownie deoploy.  Change this later
  const deployNumber = 1;

  // get account and chain id of the connected wallet
  const { chainId } = useEthers();
  const stringChainId = String(chainId);

  // setup addresses to be used later.
  const swapAddress =
    stringChainId in networkMapping
      ? chainId
        ? networkMapping[stringChainId]["Swap"][deployNumber]
        : constants.AddressZero
      : constants.AddressZero;

  // create the contract to connect and call solidity functions on the blockchain
  const swapContract = new Contract(swapAddress, swap["abi"]);
  return swapContract;
};

import {
  useEthers,
  useTokenBalance,
  useCall,
  useContractFunction,
} from "@usedapp/core";
import { Contract } from "@ethersproject/contracts";
import networkMapping from "../contract_map.json";
import { BigNumber, constants } from "ethers";
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  TextField,
} from "@mui/material";
import swap from "../Swap.json";
import { useState } from "react";

export const Main = () => {
  // set deploy number from the brownie deoploy.  Change this later
  const deployNumber = 1;

  // get account and chain id of the connected wallet
  const { chainId, account } = useEthers();
  const accountAddress = account ? account : constants.AddressZero;
  const stringChainId = String(chainId);

  // setup addresses to be used later.
  let thanksAddress;
  let rewardsAddress;
  let swapAddress;
  let connected;
  let isConnected = account !== undefined;

  // If the chainId is within the JSON, pull the addresses, else set the addresses to 0
  if (stringChainId in networkMapping) {
    thanksAddress = chainId
      ? networkMapping[stringChainId]["ThankYouToken"][deployNumber]
      : constants.AddressZero;

    rewardsAddress = chainId
      ? networkMapping[stringChainId]["RewardsToken"][deployNumber]
      : constants.AddressZero;

    swapAddress = chainId
      ? networkMapping[stringChainId]["Swap"][deployNumber]
      : constants.AddressZero;

    if (isConnected) {
      connected = "(Ropsten)";
    } else {
      connected = "(Connect to Ropsten)";
    }
  } else {
    thanksAddress = constants.AddressZero;
    rewardsAddress = constants.AddressZero;
    swapAddress = constants.AddressZero;
    connected = "(Connect to Ropsten)";
  }

  // Get the token balances to display
  const thanksBalance_start = useTokenBalance(accountAddress, thanksAddress);
  const thanksBalance = thanksBalance_start
    ? thanksBalance_start
    : BigNumber.from(0);

  const rewardsBalance_start = useTokenBalance(accountAddress, rewardsAddress);
  const rewardsBalance = rewardsBalance_start
    ? rewardsBalance_start
    : BigNumber.from(0);

  // create the contract to connect and call solidity functions on the blockchain
  const swapContract = new Contract(swapAddress, swap["abi"]);

  return (
    <div>
      {Balances(connected, thanksBalance, rewardsBalance)}
      {SendAppreciation(swapContract)}
      {Admin(accountAddress, swapContract)}
    </div>
  );
};

// Styles for the header box
const BoxHeaderStyle = {
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
const BoxContainerStyle = {
  boxShadow: 3,
  backgroundColor: "#e3f2fd",
  borderRadius: 2,
  marginTop: 2,
};

// Function to display the token balances
export const Balances = (
  connected: string,
  thanksBalance: BigNumber,
  rewardsBalance: BigNumber
) => {
  return (
    <div>
      <Box sx={BoxContainerStyle}>
        <Box sx={BoxHeaderStyle}>Current holdings {connected}</Box>
        <List>
          <ListItem divider>
            <ListItemText
              primary="Thank you tokens"
              secondary={thanksBalance.toString()}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Reward tokens"
              secondary={rewardsBalance.toString()}
            />
          </ListItem>
        </List>
      </Box>
    </div>
  );
};

// Function to display container that allows sending thanks tokens to other user
export const SendAppreciation = (swapContract: Contract) => {
  const [formData, setFormData] = useState({
    appreciationAddress: "",
    appreciationAmount: "",
    appreciationMessage: "",
  });

  return (
    <div>
      <Box sx={BoxContainerStyle}>
        <Box sx={BoxHeaderStyle}>Send Appreciation</Box>
        <form>
          <TextField
            label="User address"
            variant="outlined"
            id="appreciation-address"
            sx={{ m: 1, width: "79%" }}
            value={formData.appreciationAddress}
            onChange={(e) =>
              setFormData({ ...formData, appreciationAddress: e.target.value })
            }
          />
          <TextField
            label="Amount"
            variant="outlined"
            id="appreciation-amount"
            sx={{ m: 1, width: "15%" }}
            value={formData.appreciationAmount}
            onChange={(e) =>
              setFormData({ ...formData, appreciationAmount: e.target.value })
            }
          />
          <TextField
            label="Appreciation message"
            variant="outlined"
            id="appreciation-message"
            sx={{ m: 1, width: "97%" }}
            value={formData.appreciationMessage}
            onChange={(e) =>
              setFormData({ ...formData, appreciationMessage: e.target.value })
            }
          />
          <Button onClick={() => SendThanks(swapContract)}>Submit</Button>
        </form>
      </Box>
    </div>
  );
};

// Actually sending the thanks tokens
const SendThanks = (swapContract: Contract) => {
  // add stuff here
};

// Admin container that has additional functionality that only the admin of the contract can
// call.  Security is placed on the blockchain, so only the holder of the owner public address
// can call these functions, even outside of the HTML
export const Admin = (accountAddress: string, swapContract: Contract) => {
  let adminAddressResult = useCall({
    contract: swapContract,
    method: "owner",
    args: [],
  });
  const adminAddress = adminAddressResult
    ? adminAddressResult.value
      ? adminAddressResult.value[0]
      : constants.AddressZero
    : constants.AddressZero;

  const [formData, setFormData] = useState({
    newAddress: "",
  });

  if (adminAddress === accountAddress) {
    return (
      <div>
        <Box sx={BoxContainerStyle}>
          <Box sx={BoxHeaderStyle}>Admin Activities</Box>
          <form>
            <TextField
              label="New user address"
              variant="outlined"
              id="newAddress"
              sx={{ m: 1, width: "97%" }}
              value={formData.newAddress}
              onChange={(e) =>
                setFormData({ ...formData, newAddress: e.target.value })
              }
            />
            <Button onClick={() => AddUser(swapContract, formData.newAddress)}>
              Submit
            </Button>
          </form>
        </Box>
      </div>
    );
  } else {
    return <div></div>;
  }
};

// Fucntion to add a users address to the swap contract to allow sending and receiving
// of thanks and rewards tokens
const AddUser = (swapContract: Contract, newAddress: string) => {
  const { state, send } = useContractFunction(swapContract, "addAddress", {
    transactionName: "NewAddress",
  });
  send.arguments(newAddress);
};

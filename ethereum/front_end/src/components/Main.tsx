import { useEthers, useTokenBalance, useCall } from "@usedapp/core";
import { Contract } from "@ethersproject/contracts";
import networkMapping from "../contract_map.json";
import { constants } from "ethers";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import swap from "../Swap.json";

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
  const thanksBalance = thanksBalance_start ? thanksBalance_start : 0;

  const rewardsBalance_start = useTokenBalance(accountAddress, rewardsAddress);
  const rewardsBalance = rewardsBalance_start ? rewardsBalance_start : 0;

  const swapContract = new Contract(swapAddress, swap["abi"]);

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
  console.log(adminAddress);

  if (adminAddress === accountAddress) {
    return (
      <div>
        <Box sx={{ boxShadow: 3, backgroundColor: "#e3f2fd", borderRadius: 2 }}>
          <Box
            sx={{
              p: 2,
              fontSize: "h1.fontsize",
              fontWeight: "bold",
              textAlign: "center",
              backgroundColor: "primary.dark",
              color: "white",
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
            }}
          >
            Current holdings {connected}
          </Box>
          <List>
            <ListItem divider>
              <ListItemText
                primary="Thank you tokens"
                secondary={thanksBalance}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Reward tokens"
                secondary={rewardsBalance}
              />
            </ListItem>
          </List>
        </Box>
        <Box
          sx={{
            boxShadow: 3,
            backgroundColor: "#e3f2fd",
            borderRadius: 2,
            marginTop: 5,
          }}
        >
          <Box
            sx={{
              p: 2,
              fontSize: "h1.fontsize",
              fontWeight: "bold",
              textAlign: "center",
              backgroundColor: "primary.dark",
              color: "white",
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
            }}
          >
            Admin Activities
          </Box>
        </Box>
      </div>
    );
  } else {
    return (
      <div>
        <Box sx={{ boxShadow: 3, backgroundColor: "#e3f2fd", borderRadius: 2 }}>
          <Box
            sx={{
              p: 2,
              fontSize: "h1.fontsize",
              fontWeight: "bold",
              textAlign: "center",
              backgroundColor: "primary.dark",
              color: "white",
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
            }}
          >
            Current holdings {connected}
          </Box>
          <List>
            <ListItem divider>
              <ListItemText
                primary="Thank you tokens"
                secondary={thanksBalance}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Reward tokens"
                secondary={rewardsBalance}
              />
            </ListItem>
          </List>
        </Box>
      </div>
    );
  }
};

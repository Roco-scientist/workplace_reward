import { useEthers, useTokenBalance } from "@usedapp/core";
import networkMapping from "../contract_map.json";
import { BigNumber, constants } from "ethers";
import { Box, List, ListItem, ListItemText } from "@mui/material";
import { BoxContainerStyle, BoxHeaderStyle } from "./Common";

export const Balances = () => {
  // set deploy number from the brownie deoploy.  Change this later
  const deployNumber = 1;

  // get account and chain id of the connected wallet
  const { chainId, account } = useEthers();
  const accountAddress = account ? account : constants.AddressZero;
  const stringChainId = String(chainId);

  // setup addresses to be used later.
  let thanksAddress;
  let rewardsAddress;
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

    if (isConnected) {
      connected = "(Ropsten)";
    } else {
      connected = "(Connect to Ropsten)";
    }
  } else {
    thanksAddress = constants.AddressZero;
    rewardsAddress = constants.AddressZero;
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

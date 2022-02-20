import { useCall, useEthers, useToken, useTokenBalance } from "@usedapp/core";
import networkMapping from "../contract_map.json";
import { BigNumber, constants } from "ethers";
import { Box, List, ListItem, ListItemText } from "@mui/material";
import {
  BoxContainerStyle,
  BoxHeaderStyle,
  deployNumber,
  RewardsContract,
  ThanksContract,
} from "./Common";
import { formatUnits } from "@ethersproject/units";

export const Balances = () => {
  const thanksContract = ThanksContract();
  const rewardsContract = RewardsContract();
  
  const thanksPausedResult = useCall({
    contract: thanksContract,
    method: "paused",
    args: [],
  });

  const thanksPaused: boolean = thanksPausedResult
    ? thanksPausedResult.value
      ? thanksPausedResult.value[0]
      : false
    : false;

  const rewardsPausedResult = useCall({
    contract: rewardsContract,
    method: "paused",
    args: [],
  });

  const rewardsPaused: boolean = rewardsPausedResult
    ? rewardsPausedResult.value
      ? rewardsPausedResult.value[0]
      : false
    : false;


  // get account and chain id of the connected wallet
  const { account } = useEthers();
  const accountAddress = account ? account : constants.AddressZero;

  // setup addresses to be used later.
  const connected = account !== undefined ? "(Connected)": "(Not connected)";


  // Get the token balances to display
  const thanksBalance_start = useTokenBalance(thanksContract.address, accountAddress);
  const thanksBalance = thanksBalance_start
    ? thanksBalance_start
    : BigNumber.from(0);

  const rewardsBalance_start = useTokenBalance(rewardsContract.address, accountAddress);
  const rewardsBalance = rewardsBalance_start
    ? rewardsBalance_start
    : BigNumber.from(0);

  const thanksInfo = useToken(thanksContract.address);
  const thanksDecimals = thanksInfo
    ? thanksInfo.decimals
      ? thanksInfo.decimals
      : 18
    : 18;

  const rewardsInfo = useToken(rewardsContract.address);
  const rewardsDecimals = rewardsInfo
    ? rewardsInfo.decimals
      ? rewardsInfo.decimals
      : 18
    : 18;

  return (
    <div>
      <Box sx={BoxContainerStyle}>
        <Box sx={BoxHeaderStyle}>Current holdings {connected}</Box>
        <List>
          <ListItem divider>
            <ListItemText
              primary={thanksPaused ? "Thank you tokens (inactive)" : "Thank you tokens (active)" }
              secondary={formatUnits(thanksBalance, thanksDecimals)}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary={rewardsPaused ? "Reward tokens (inactive)" : "Reward tokens (active)" }
              secondary={formatUnits(rewardsBalance, rewardsDecimals)}
            />
          </ListItem>
        </List>
      </Box>
    </div>
  );
};

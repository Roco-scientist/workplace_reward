import { useEthers, useTokenBalance } from "@usedapp/core";
import networkMapping from "../contract_map.json";
import { constants } from "ethers";
import Box from "@mui/material/Box";

export const Main = () => {
  // set deploy number from the brownie deoploy.  Change this later
  const deployNumber = 1;

  // get account and chain id of the connected wallet
  const { chainId, account } = useEthers();
  const stringChainId = String(chainId);

  // setup addresses to be used later.
  let thanksAddress;
  let rewardsAddress;
  let connected;

  // If the chainId is within the JSON, pull the addresses, else set the addresses to 0
  if (stringChainId in networkMapping) {
    thanksAddress = chainId
      ? networkMapping[stringChainId]["ThankYouToken"][deployNumber]
      : constants.AddressZero;

    rewardsAddress = chainId
      ? networkMapping[stringChainId]["RewardsToken"][deployNumber]
      : constants.AddressZero;

    const swapAddress = chainId
      ? networkMapping[stringChainId]["Swap"][deployNumber]
      : constants.AddressZero;
    console.log(swapAddress);

    connected = "Connected";
  } else {
    thanksAddress = constants.AddressZero;
    rewardsAddress = constants.AddressZero;
    connected = "Connect to Ropsten";
  }

  // Get the token balances to display
  const thanksBalance_start = useTokenBalance(account, thanksAddress);
  const thanksBalance = thanksBalance_start ? thanksBalance_start : 0;

  const rewardsBalance_start = useTokenBalance(account, rewardsAddress);
  const rewardsBalance = rewardsBalance_start ? rewardsBalance_start : 0;

  return (
    <div>
      <Box sx={{ p: 2, border: "1px dashed grey" }}>
        Current holdings {connected}
      </Box>
      <Box sx={{ p: 2, border: "1px dashed grey" }}>
        Thank you tokens: {thanksBalance}
      </Box>
      <Box sx={{ p: 2, border: "1px dashed grey" }}>
        Rewards: {rewardsBalance}
      </Box>
    </div>
  );
};

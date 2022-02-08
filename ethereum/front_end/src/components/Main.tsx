import { useEthers, useTokenBalance } from "@usedapp/core";
import networkMapping from "../contract_map.json";
import { constants } from "ethers";
import Box from "@mui/material/Box";
import { styled } from "@mui/system";

const StyledBox = styled("div")({
  color: "darkslategray",
  backgroundColor: "aliceblue",
  padding: 8,
  borderRadius: 4,
});

export const Main = () => {
  // set deploy number from the brownie deoploy.  Change this later
  const deployNumber = 1;

  // get account and chain id of the connected wallet
  const { chainId, account } = useEthers();
  const account_address = account ? account : constants.AddressZero;
  const stringChainId = String(chainId);

  // setup addresses to be used later.
  let thanksAddress;
  let rewardsAddress;
  let swapAddress;
  let connected;

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

    connected = "(Ropsten)";
  } else {
    thanksAddress = constants.AddressZero;
    rewardsAddress = constants.AddressZero;
    swapAddress = constants.AddressZero;
    connected = "(Connect to Ropsten)";
  }

  // Get the token balances to display
  const thanksBalance_start = useTokenBalance(account_address, thanksAddress);
  const thanksBalance = thanksBalance_start ? thanksBalance_start : 0;

  const rewardsBalance_start = useTokenBalance(account_address, rewardsAddress);
  const rewardsBalance = rewardsBalance_start ? rewardsBalance_start : 0;

  return (
    <StyledBox>
      <Box sx={{ boxShadow: 3 }}>
        <Box sx={{ p: 2, border: "1px black" }}>
          Current holdings {connected}
        </Box>
        <Box sx={{ p: 2, border: "1px black" }}>
          Thank you tokens: {thanksBalance}
        </Box>
        <Box sx={{ p: 2, border: "1px black" }}>Rewards: {rewardsBalance}</Box>
        {Admin(account_address, swapAddress)}
      </Box>
    </StyledBox>
  );
};

const Admin = (account_address: string, swapAddress: string) => {
  let admin_account = false;
  // let admin_address = useCall()
  if (admin_account) {
    return (
      <div>
        <Box
          sx={{ p: 2, border: "1px black", backgroundColor: "primary.dark" }}
        >
          Admin stuff
        </Box>
      </div>
    );
  } else {
    return <div></div>;
  }
};

import { useToken, useTokenBalance } from "@usedapp/core";
import { BigNumber } from "ethers";
import { ListItemText, Paper, Stack } from "@mui/material";
import { SwapContract, ThanksContract, RewardsContract } from "./Common";
import { formatUnits } from "@ethersproject/units";

export const ContractBalance = () => {
  // Get the swap contract to call its functions
  const swapContract = SwapContract();
  const thanksContract = ThanksContract();
  const rewardsContract = RewardsContract();

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

  const swapContractThanks = useTokenBalance(
    thanksContract.address,
    swapContract.address
  );
  const swapContractThanksBalance = swapContractThanks
    ? swapContractThanks
    : BigNumber.from(0);

  const swapContractRewards = useTokenBalance(
    rewardsContract.address,
    swapContract.address
  );
  const swapContractRewardsBalance = swapContractRewards
    ? swapContractRewards
    : BigNumber.from(0);

  return (
    <div>
      <Stack
        direction="row"
        justifyContent="space-around"
        alignItems="center"
        spacing={2}
      >
        <ListItemText>Contract Balance:</ListItemText>
        <ListItemText
          primary="Thank you tokens"
          secondary={formatUnits(swapContractThanksBalance, thanksDecimals)}
        />
        <ListItemText
          primary="Reward tokens"
          secondary={formatUnits(swapContractRewardsBalance, rewardsDecimals)}
        />
      </Stack>
    </div>
  );
};

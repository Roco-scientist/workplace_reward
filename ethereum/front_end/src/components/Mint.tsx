import { useContractFunction, useNotifications, useToken } from "@usedapp/core";
import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { SwapContract, ThanksContract, RewardsContract } from "./Common";

export const Mint = () => {
  const { notifications } = useNotifications();

  const thanksInfo = useToken(ThanksContract().address);
  const thanksDecimals = thanksInfo
    ? thanksInfo.decimals
      ? thanksInfo.decimals
      : 18
    : 18;

  const rewardsInfo = useToken(RewardsContract().address);
  const rewardsDecimals = rewardsInfo
    ? rewardsInfo.decimals
      ? rewardsInfo.decimals
      : 18
    : 18;

  // data that is set by the form
  const [mintData, setMintData] = useState({
    thanksAmount: "",
    rewardsAmount: "",
  });

  // Get approval for sending thanks token from the user
  const {
    send: mintTokens,
    state: mintTokensState,
    resetState: mintTokensReset,
  } = useContractFunction(SwapContract(), "addMintedTokens", {
    transactionName: "Mint tokens",
  });

  // Test to see if the app is busy either getting approval or sending the coin.
  // This is used to set the submit button to disabled
  const mintIsBusy =
    mintTokensState.status === "Mining" ||
    mintTokensState.status === "PendingSignature";

  // Function to get the ball rolling after user hits submit
  const mintContractTokens = () => {
    const thanksAmount = BigInt(
      parseFloat(mintData.thanksAmount) * 10 ** thanksDecimals
    ).toString();
    const rewardsAmount = BigInt(
      parseFloat(mintData.rewardsAmount) * 10 ** rewardsDecimals
    ).toString();
    mintTokens(thanksAmount, rewardsAmount);
  };

  useEffect(() => {
    if (
      notifications.filter(
        (notification) =>
          notification.type === "transactionSucceed" &&
          notification.transactionName === "Mint tokens"
      ).length > 0
    ) {
      setMintData({ thanksAmount: "", rewardsAmount: "" });
      mintTokensReset();
    }
  }, [notifications, mintTokensReset]);

  return (
    <div>
      <Stack
        direction="row"
        justifyContent="space-around"
        alignItems="center"
        spacing={2}
      >
        <TextField
          label="Thanks you tokens"
          variant="outlined"
          id="thanks-amount"
          value={mintData.thanksAmount}
          onChange={(e) =>
            setMintData({ ...mintData, thanksAmount: e.target.value })
          }
        />
        <TextField
          label="Rewards tokens"
          variant="outlined"
          id="rewards-amount"
          value={mintData.rewardsAmount}
          onChange={(e) =>
            setMintData({ ...mintData, rewardsAmount: e.target.value })
          }
        />
        <Button onClick={() => mintContractTokens()} disabled={mintIsBusy} variant="contained">
          {mintIsBusy ? <CircularProgress size={26} /> : "Mint"}
        </Button>
      </Stack>
    </div>
  );
};

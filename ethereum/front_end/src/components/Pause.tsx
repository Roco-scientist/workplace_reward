import { useCall, useContractFunction, useNotifications } from "@usedapp/core";
import {
  Alert,
  Button,
  CircularProgress,
  Snackbar,
  Stack,
} from "@mui/material";
import { useEffect, useState } from "react";
import { ThanksContract, RewardsContract } from "./Common";

export const Pause = () => {
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

  const {
    send: pauseThanksTokens,
    state: pauseThanksTokensState,
    resetState: pauseThanksTokensReset,
  } = useContractFunction(thanksContract, "pause", {
    transactionName: "Pause thanks token",
  });
  const {
    send: unpauseThanksTokens,
    state: unpauseThanksTokensState,
    resetState: unpauseThanksTokensReset,
  } = useContractFunction(thanksContract, "unpause", {
    transactionName: "Unpause thanks token",
  });

  const {
    send: pauseRewardsTokens,
    state: pauseRewardsTokensState,
    resetState: pauseRewardsTokensReset,
  } = useContractFunction(rewardsContract, "pause", {
    transactionName: "Pause rewards token",
  });
  const {
    send: unpauseRewardsTokens,
    state: unpauseRewardsTokensState,
    resetState: unpauseRewardsTokensReset,
  } = useContractFunction(rewardsContract, "unpause", {
    transactionName: "Unpause rewards token",
  });

  const changeThanksPause = () => {
    if (thanksPaused) {
      unpauseThanksTokens();
    } else {
      pauseThanksTokens();
    }
  };

  const changeRewardsPause = () => {
    if (rewardsPaused) {
      unpauseRewardsTokens();
    } else {
      pauseRewardsTokens();
    }
  };

  const thanksPauseIsBusy =
    pauseThanksTokensState.status === "Mining" ||
    pauseThanksTokensState.status === "PendingSignature" ||
    unpauseThanksTokensState.status === "Mining" ||
    unpauseThanksTokensState.status === "PendingSignature";

  const rewardsPauseIsBusy =
    pauseRewardsTokensState.status === "Mining" ||
    pauseRewardsTokensState.status === "PendingSignature" ||
    unpauseRewardsTokensState.status === "Mining" ||
    unpauseRewardsTokensState.status === "PendingSignature";

  return (
    <div>
      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
      >
        <Button
          onClick={() => changeThanksPause()}
          disabled={thanksPauseIsBusy}
          variant="contained"
        >
          {thanksPauseIsBusy ? (
            <CircularProgress size={26} />
          ) : thanksPaused ? (
            "Unpause thanks token"
          ) : (
            "Pause thanks token"
          )}
        </Button>
        <Button
          onClick={() => changeRewardsPause()}
          disabled={rewardsPauseIsBusy}
          variant="contained"
        >
          {rewardsPauseIsBusy ? (
            <CircularProgress size={26} />
          ) : rewardsPaused ? (
            "Unpause rewards token"
          ) : (
            "Pause rewards token"
          )}
        </Button>
      </Stack>
    </div>
  );
};

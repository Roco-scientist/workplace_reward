import { useContractFunction, useCall } from "@usedapp/core";
import {
  Box,
  Button,
  CircularProgress,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  BoxContainerStyle,
  BoxHeaderStyle,
  SwapContract,
  ThanksContract,
} from "./Common";

export const SendAppreciation = () => {
  const swapContract = SwapContract();

  const [formData, setFormData] = useState({
    appreciationAddress: "",
    appreciationAmount: "",
    appreciationMessage: "",
  });

  // Retrieve the number of decimal places the Thanks token holds.  Smart contracts do
  // not have float, so ERC20 token use an integer and set the number of decimals.  Therefor
  // whatever input value the user puts, this needs to be multiplied by 10^DECIMALS
  let thanksDecimalsResult = useCall({
    contract: ThanksContract(),
    method: "decimals",
    args: [],
  });
  const thanksDecimals = thanksDecimalsResult
    ? thanksDecimalsResult.value
      ? thanksDecimalsResult.value[0]
      : 18
    : 18;

  // Get approval for sending thanks token from the user
  const {
    send: approveThanks,
    state: approveThanksState,
    resetState: approveReset,
  } = useContractFunction(ThanksContract(), "approve", {
    transactionName: "Approve Thanks token send",
  });
  const approveAndSendThanks = () => {
    const amount =
      parseFloat(formData.appreciationAmount) * 10 ** thanksDecimals;

    approveThanks(swapContract.address, BigInt(amount).toString());
  };

  // Send thanks to other user
  const {
    send: sendThanks,
    state: sendThanksState,
    resetState: sendReset,
  } = useContractFunction(swapContract, "sendThanks", {
    transactionName: "Send thanks token to other user",
  });

  // During every render check if sending thanks was approved by the user and this transactionName
  // finished, then also that the thanks has not yet been sent.  If so, then send the thanks that were
  // approved
  useEffect(() => {
    if (
      approveThanksState.status === "Success" &&
      sendThanksState.status === "None"
    ) {
      const amount =
        parseFloat(formData.appreciationAmount) * 10 ** thanksDecimals;
      sendThanks(BigInt(amount).toString(), formData.appreciationAddress);
    }
  }, [
    approveThanksState,
    sendThanks,
    formData,
    sendThanksState,
    thanksDecimals,
  ]);

  // If both transactions were a success reset to allow further transactions
  useEffect(() => {
    if (
      approveThanksState.status === "Success" &&
      sendThanksState.status === "Success"
    ) {
      approveReset();
      sendReset();
    }
  });

  // Test to see if the app is busy either getting approval or sending the coin.
  // This is used to set the submit button to disabled
  const sendIsBusy =
    approveThanksState.status === "Mining" ||
    approveThanksState.status === "PendingSignature" ||
    sendThanksState.status === "Mining" ||
    sendThanksState.status === "PendingSignature";

  // Function to get the ball rolling after user hits submit
  const SendThanks = () => {
    approveAndSendThanks();
  };
  return (
    <div>
      <Box sx={BoxContainerStyle}>
        <Box sx={BoxHeaderStyle}>Send Appreciation</Box>
        <form>
          <InputLabel id="appreciation-address">Co-worker</InputLabel>
          <Select
            id="appreciation-address"
            sx={{ m: 1, width: "79%" }}
            value={formData.appreciationAddress}
            onChange={(e) =>
              setFormData({ ...formData, appreciationAddress: e.target.value })
            }
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value="0x3bD7736bB6feA5ebe2AC8eb7F380D0963D92d473">
              Joe
            </MenuItem>
            <MenuItem value="0x6cE09101fcE65B6619606a7e0B91ef85dD99B5e5">
              Mary
            </MenuItem>
          </Select>

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
          <InputLabel id="appreciation-message">Message</InputLabel>
          <Select
            id="appreciation-message"
            sx={{ m: 1, width: "97%" }}
            value={formData.appreciationMessage}
            onChange={(e) =>
              setFormData({ ...formData, appreciationMessage: e.target.value })
            }
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={0}>You're the best</MenuItem>
            <MenuItem value={1}>
              Could never have completed without you
            </MenuItem>
          </Select>
          <Button onClick={() => SendThanks()} disabled={sendIsBusy}>
            {sendIsBusy ? <CircularProgress size={26} /> : "Submit"}
          </Button>
        </form>
      </Box>
    </div>
  );
};

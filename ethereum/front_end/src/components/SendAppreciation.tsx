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
import { useState } from "react";
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

  const { send: sendThanks, state: sendThanksState } = useContractFunction(
    swapContract,
    "sendThanks",
    {
      transactionName: "Send thanks token to other user",
    }
  );

  const isSendingThanks =
    sendThanksState.status === "Mining" ||
    sendThanksState.status === "PendingSignature";

  // Actually sending the thanks tokens
  const SendThanks = () => {
    const appreciationAmt = parseFloat(formData.appreciationAmount) * thanksDecimals;
    sendThanks(appreciationAmt, formData.appreciationAddress);
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
          <Button onClick={() => SendThanks()} disabled={isSendingThanks}>
            {isSendingThanks ? <CircularProgress size={26} /> : "Submit"}
          </Button>
        </form>
      </Box>
    </div>
  );
};

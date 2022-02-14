import {
  useContractFunction,
  useCall,
  useEthers,
  useNotifications,
} from "@usedapp/core";
import { constants } from "ethers";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  BoxContainerStyle,
  BoxHeaderStyle,
  SwapContract,
  ThanksContract,
} from "./Common";

interface User {
  name: string;
  address: string;
  group: number;
}

interface Compliment {
  message: string;
  group: number;
}

export const SendAppreciation = () => {
  // retrieve the account which is logged in and set the address to zeros if it is not logged in
  const { account, deactivate } = useEthers();
  const [previousAccount, setPreviousAccount] = useState(constants.AddressZero);

  const defaultUsers: User[] = [];
  const [users, setUsers] = useState(defaultUsers);

  const defaultCompliments: Compliment[] = [];
  const [compliments, setCompliments] = useState(defaultCompliments);

  useEffect(() => {
    const accountAddress = account ? account : constants.AddressZero;
    fetch("http://localhost:3080/api/users?accountAddress=" + accountAddress)
      .then((response) => response.json())
      .then((response) => setUsers(response));

    fetch(
      "http://localhost:3080/api/compliments?accountAddress=" + accountAddress
    )
      .then((response) => response.json())
      .then((response) => setCompliments(response));
  }, [setUsers, setCompliments, account]);

  // Setup notifications to display when transactions are a success
  const { notifications } = useNotifications();

  // Get the swap contract to perform contract functions later
  const swapContract = SwapContract();

  // data that is set by the form
  const [formData, setFormData] = useState({
    appreciationAddress: "",
    appreciationAmount: "",
    appreciationMessage: "",
  });

  // Reset forms on address change or wallet disconnect.  Also disconnect wallet on address change
  useEffect(() => {
    const accountAddress = account ? account : constants.AddressZero;
    if (accountAddress !== previousAccount) {
      setFormData({
        appreciationAddress: "",
        appreciationAmount: "",
        appreciationMessage: "",
      });
      if (previousAccount !== constants.AddressZero) {
        deactivate();
      }
      setPreviousAccount(accountAddress);
    }
  }, [setFormData, account, previousAccount, deactivate]);

  // Retrieve the number of decimal places the Thanks token holds.  Smart contracts do
  // not have float, so ERC20 token use an integer and set the number of decimals.  Therefor,
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

  // During every render,  check if approval by the user was successfully added to the blockchain,
  // then check if the user has not yet sent the tokens.  If these conditions are met, send the thanks that were
  // approved
  // If both transactions were a success reset to allow further transactions
  useEffect(() => {
    if (approveThanksState.status === "Success") {
      // If coins have not been sent yet, send, otherwise reset
      if (sendThanksState.status === "None") {
        const amount =
          parseFloat(formData.appreciationAmount) * 10 ** thanksDecimals;
        sendThanks(BigInt(amount).toString(), formData.appreciationAddress);
      } else if (sendThanksState.status === "Success") {
        approveReset();
        sendReset();
        setFormData({
          appreciationAmount: "",
          appreciationAddress: "",
          appreciationMessage: "",
        });
      }
    }
  }, [
    setFormData,
    approveReset,
    sendReset,
    approveThanksState,
    sendThanksState,
    formData,
    sendThanks,
    thanksDecimals,
  ]);

  // Create status information that shows the user whether their thanks
  // token has been approved and whether it has been sent
  const [showThanksApprovalSuccess, setShowThanksApprovalSuccess] =
    useState(false);
  const [showSendTokenSuccess, setShowSendTokenSuccess] = useState(false);
  const handleCloseSnack = () => {
    setShowThanksApprovalSuccess(false);
    setShowSendTokenSuccess(false);
  };
  // Pull notification on the process and set notification display
  useEffect(() => {
    if (
      notifications.filter(
        (notification) =>
          notification.type === "transactionSucceed" &&
          notification.transactionName === "Approve Thanks token send"
      ).length > 0
    ) {
      setShowThanksApprovalSuccess(true);
      setShowSendTokenSuccess(false);
    }
    if (
      notifications.filter(
        (notification) =>
          notification.type === "transactionSucceed" &&
          notification.transactionName === "Send thanks token to other user"
      ).length > 0
    ) {
      setShowThanksApprovalSuccess(false);
      setShowSendTokenSuccess(true);
    }
  }, [notifications, showThanksApprovalSuccess, showSendTokenSuccess]);

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
        <form id="send-thanks-form">
          <InputLabel id="appreciation-address">Co-worker</InputLabel>
          <Select
            id="appreciation-address"
            sx={{ m: 1, width: "79%" }}
            value={formData.appreciationAddress}
            onChange={(e) =>
              setFormData({ ...formData, appreciationAddress: e.target.value })
            }
          >
            <MenuItem value="" key="NoUser">
              <em>None</em>
            </MenuItem>
            {users.map((user) => {
              return (
                <MenuItem value={user.address} key={user.address}>
                  {user.name}
                </MenuItem>
              );
            })}
            {}
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
            <MenuItem value="" key="NoCompliment">
              <em>None</em>
            </MenuItem>
            {compliments.map((compliment, i) => {
              return (
                <MenuItem value={i} key={i}>
                  {compliment.message}
                </MenuItem>
              );
            })}
          </Select>
          <Button onClick={() => SendThanks()} disabled={sendIsBusy}>
            {sendIsBusy ? <CircularProgress size={26} /> : "Submit"}
          </Button>
        </form>
        <Snackbar
          open={showThanksApprovalSuccess}
          autoHideDuration={5000}
          onClose={handleCloseSnack}
        >
          <Alert onClose={handleCloseSnack} severity="success">
            Thanks token transfer approved! Now approve sending.
          </Alert>
        </Snackbar>
        <Snackbar
          open={showSendTokenSuccess}
          autoHideDuration={5000}
          onClose={handleCloseSnack}
        >
          <Alert onClose={handleCloseSnack} severity="success">
            Thanks sent!
          </Alert>
        </Snackbar>
      </Box>
    </div>
  );
};

import {
  useEthers,
  useContractFunction,
  useNotifications,
} from "@usedapp/core";
import { constants } from "ethers";
import {
  Alert,
  Button,
  CircularProgress,
  InputLabel,
  MenuItem,
  Snackbar,
  Select,
} from "@mui/material";
import { MonthPicker } from "@mui/lab";
import { useEffect, useState } from "react";
import { EotmContract, User } from "./Common";

export const Eotm = () => {
  // Setup notifications to display when transactions are a success
  const { notifications } = useNotifications();

  // retrieve the account which is logged in and set the address to zeros if it is not logged in
  const { account } = useEthers();

  // Get the EOTM contract
  const eotmContract = EotmContract();

  const { send: mintEotm, state: mintEotmState } = useContractFunction(
    eotmContract,
    "safeMint",
    {
      transactionName: "Mint EOTM NFT",
    }
  );

  const defaultUsers: User[] = [];
  const [users, setUsers] = useState(defaultUsers);
  useEffect(() => {
    const accountAddress = account ? account : constants.AddressZero;
    fetch(
      "http://localhost:3080/api/users/all?accountAddress=" + accountAddress
    )
      .then((response) => response.json())
      .then((response) => setUsers(response));
  }, [setUsers, account]);

  // Test to see if the app is busy either getting approval or sending the coin.
  // This is used to set the submit button to disabled
  const sendIsBusy =
    mintEotmState.status === "Mining" ||
    mintEotmState.status === "PendingSignature";

  const [showEotmSendSuccess, setShowEotmSendSuccess] = useState(false);

  // Pull notification on the process and set notification display
  useEffect(() => {
    if (
      notifications.filter(
        (notification) =>
          notification.type === "transactionSucceed" &&
          notification.transactionName === "Mint EOTM NFT"
      ).length > 0
    ) {
      setShowEotmSendSuccess(true);
      setEotmAddress("");
    }
  }, [setShowEotmSendSuccess, notifications]);

  const handleCloseSnack = () => {
    setShowEotmSendSuccess(false);
  };

  const [eotmAddress, setEotmAddress] = useState("");
  const [eotmMonth, setEotmMonth] = useState(new Date());

  // Function activated after then send button is clicked
  const SendEotm = () => {
    const test_uri = "ipfs://QmTELAJwk3PoCyvFtGHBnMuFXZJykKbMDqVqBcsoQimhpq";
    mintEotm(eotmAddress, test_uri);
  };

  return (
    <div>
      <form id="send-thanks-form">
        <MonthPicker
          date={new Date()}
          minDate={new Date(2017, 1)}
          value={eotmMonth}
          onChange={(e) => setEotmMonth(e.target.value)}
        />
        <InputLabel id="appreciation-address">Co-worker</InputLabel>
        <Select
          id="eotm-address"
          value={eotmAddress}
          onChange={(e) => setEotmAddress(e.target.value)}
        >
          <MenuItem value="" key="NoUser">
            <em>None</em>
          </MenuItem>
          {users.map((user) => {
            return (
              <MenuItem value={user.address} key={user.address}>
                {user.firstName + " " + user.lastName}
              </MenuItem>
            );
          })}
          {}
        </Select>
        <Button
          onClick={() => SendEotm()}
          disabled={sendIsBusy}
          variant="contained"
        >
          {sendIsBusy ? <CircularProgress size={26} /> : "Send"}
        </Button>
      </form>
      <Snackbar
        open={showEotmSendSuccess}
        autoHideDuration={5000}
        onClose={handleCloseSnack}
      >
        <Alert onClose={handleCloseSnack} severity="success">
          Thanks sent!
        </Alert>
      </Snackbar>
    </div>
  );
};

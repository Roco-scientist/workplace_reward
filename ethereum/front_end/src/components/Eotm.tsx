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
  Stack,
  TextField,
} from "@mui/material";
import { DatePicker } from "@mui/lab";
import { useEffect, useState } from "react";
import { EotmContract, User } from "./Common";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import axios from "axios";

export const Eotm = () => {
  // Setup notifications to display when transactions are a success
  const { notifications } = useNotifications();

  // retrieve the account which is logged in and set the address to zeros if it is not logged in
  const { account } = useEthers();

  const today = new Date();
  const month = new Date(today.getFullYear(), today.getMonth());
  const [eotmData, setEotmData] = useState({
    month: month,
    address: "",
  });

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

  const [pinningNft, setPinningNft] = useState(false);
  // Test to see if the app is busy either getting approval or sending the coin.
  // This is used to set the submit button to disabled
  const sendIsBusy =
    mintEotmState.status === "Mining" ||
    mintEotmState.status === "PendingSignature" ||
    pinningNft;

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
      setEotmData({ month: new Date(), address: "" });
      setPinningNft(false);
    }
  }, [setShowEotmSendSuccess, notifications]);

  const handleCloseSnack = () => {
    setShowEotmSendSuccess(false);
  };

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Function activated after then send button is clicked
  const SendEotm = () => {
    setPinningNft(true);
    const eotmDate =
      "Employee of the month for " +
      months[eotmData.month.getMonth()] +
      " of " +
      eotmData.month.getFullYear().toString();
    axios
      .post("http://localhost:3080/api/ipfsjson", {
        description: eotmDate,
        image: "ipfs://QmcpAZkTmBeJ5RQg4XvgD2qPUqVXQgw4389FSxtMjpc9wp",
        name: "Employee of the month",
      })
      .then((response) => {
        const jsonCip = response.data?.IpfsHash;
        if (jsonCip) {
          const nftIpfs = "ipfs://" + jsonCip;
          mintEotm(eotmData.address, nftIpfs);
        }
      })
      .catch((error) => console.log(error));
  };

  return (
    <div>
      <Stack spacing={2}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            views={["year", "month"]}
            label="Year and Month"
            minDate={new Date(2017, 1)}
            maxDate={new Date(today.getFullYear() + 2, 1)}
            value={eotmData.month}
            onChange={(newDate: Date | null) =>
              setEotmData({ ...eotmData, month: newDate ? newDate : month })
            }
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
        <InputLabel id="eotm-address">Employee of the month</InputLabel>
        <Select
          id="eotm-address"
          value={eotmData.address}
          onChange={(e) =>
            setEotmData({ ...eotmData, address: e.target.value })
          }
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
      </Stack>
      <Snackbar
        open={showEotmSendSuccess}
        autoHideDuration={5000}
        onClose={handleCloseSnack}
      >
        <Alert onClose={handleCloseSnack} severity="success">
          Employee of the month NFT sent!
        </Alert>
      </Snackbar>
    </div>
  );
};

import {
  useEthers,
  useCall,
  useContractFunction,
  useNotifications,
  useToken,
  useTokenBalance,
} from "@usedapp/core";
import { BigNumber, constants } from "ethers";
import {
  Alert,
  Switch,
  Box,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid, GridRowId, GridToolbar } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import {
  SwapContract,
  BoxHeaderStyle,
  BoxContainerStyle,
  ThanksContract,
  RewardsContract,
  User,
} from "./Common";
import { formatUnits } from "@ethersproject/units";

export const Admin = () => {
  // Setup notifications to display when transactions are a success
  const { notifications } = useNotifications();

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

  const [mintNew, setMintNew] = useState(false);
  const mintNewChange = () => {
    setMintNew(!mintNew);
  };

  // retrieve the account which is logged in and set the address to zeros if it is not logged in
  const { account } = useEthers();
  const accountAddress = account ? account : constants.AddressZero;

  // Get the owner of the swap contract (adminAddress)
  let adminAddressResult = useCall({
    contract: swapContract,
    method: "owner",
    args: [],
  });
  const adminAddress = adminAddressResult
    ? adminAddressResult.value
      ? adminAddressResult.value[0]
      : constants.AddressZero
    : constants.AddressZero;

  // Amount to be distributed
  const [distributeAmount, setDistributeAmount] = useState("");

  // Distribute tokens to addresses on the contract
  const { send: distributeThanks, state: distributeThanksState } =
    useContractFunction(swapContract, "distribute", {
      transactionName: "Distribute thanks tokens",
    });

  // Distribute tokens to addresses on the contract
  const { send: distributeMintedThanks, state: distributeMintedThanksState } =
    useContractFunction(swapContract, "mintThanksToUsers", {
      transactionName: "Distribute minted thanks tokens",
    });

  const emptyIds: GridRowId[] = [];
  const [selectedIds, setSelectedIds] = useState(emptyIds);
  const emptyUsers: User[] = [];
  const [companyUsers, setCompanyUsers] = useState(emptyUsers);

  // Fucntion to add a users address to the swap contract to allow sending and receiving
  // of thanks and rewards tokens
  const Distribute = () => {
    const finalAmount = BigInt(
      parseFloat(distributeAmount) * 10 ** thanksDecimals
    ).toString();
    const selectedIdsString: string[] = selectedIds.map((gridRowId) =>
      gridRowId.toString()
    );
    const selectedUsers: User[] = companyUsers.filter((user) =>
      selectedIdsString.includes(user.id.toString())
    );
    const userAddresses: string[] = selectedUsers.map((user) => user.address);
    if (mintNew) {
      distributeMintedThanks(userAddresses, finalAmount);
    } else {
      distributeThanks(userAddresses, finalAmount);
    }
  };

  // Status of the distribution.  Used to disable distribute button when in progress
  const isDistributing =
    distributeThanksState.status === "Mining" ||
    distributeThanksState.status === "PendingSignature" ||
    distributeMintedThanksState.status === "Mining" ||
    distributeMintedThanksState.status === "PendingSignature";

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "firstName",
      headerName: "First name",
      width: 150,
    },
    {
      field: "lastName",
      headerName: "Last name",
      width: 150,
    },
  ];

  useEffect(() => {
    const accountAddress = account ? account : constants.AddressZero;
    fetch(
      "http://localhost:3080/api/users/all?accountAddress=" + accountAddress
    )
      .then((response) => response.json())
      .then((response) => setCompanyUsers(response));
  }, [setCompanyUsers, account]);

  const [showSendThanksSuccess, setShowSendThanksSuccess] = useState(false);
  const handleCloseSnack = () => {
    setShowSendThanksSuccess(false);
  };

  useEffect(() => {
    if (
      notifications.filter(
        (notification) =>
          notification.type === "transactionSucceed" &&
          (notification.transactionName === "Distribute thanks tokens" ||
            notification.transactionName === "Distribute minted thanks tokens")
      ).length > 0
    ) {
      setShowSendThanksSuccess(true);
      setSelectedIds([]);
      setDistributeAmount("");
    }
  }, [setSelectedIds, setDistributeAmount, notifications]);

  const [mintColor, setMintColor] = useState("text.disabled");
  const [balanceColor, setBalanceColor] = useState("primary.dark");
  useEffect(() => {
    if (mintNew) {
      setMintColor("primary.dark");
      setBalanceColor("text.disabled");
    } else {
      setMintColor("text.disabled");
      setBalanceColor("primary.dark");
    }
  }, [setMintColor, setBalanceColor, mintNew]);

  // If the logged in user is the admin, show this form
  if (
    adminAddress === accountAddress &&
    accountAddress !== constants.AddressZero
  ) {
    return (
      <div>
        <Box sx={BoxContainerStyle}>
          <Box sx={BoxHeaderStyle}>Admin Activities</Box>
          <List>
            <ListItem divider>
              <Box sx={{ width: "30%" }}>Contract Balance:</Box>
              <ListItemText
                primary="Thank you tokens"
                secondary={formatUnits(
                  swapContractThanksBalance,
                  thanksDecimals
                )}
              />
              <ListItemText
                primary="Reward tokens"
                secondary={formatUnits(
                  swapContractRewardsBalance,
                  rewardsDecimals
                )}
              />
            </ListItem>
            <ListItem>
              <div style={{ height: 400 }}>
                <DataGrid
                  sx={{ m: 1, width: "95%" }}
                  checkboxSelection
                  disableSelectionOnClick
                  onSelectionModelChange={(ids) => {
                    setSelectedIds(ids);
                  }}
                  rows={companyUsers}
                  columns={columns}
                  components={{
                    Toolbar: GridToolbar,
                  }}
                  columnVisibilityModel={{
                    // Hide id column which is just rowid.  id column required for module
                    id: false,
                  }}
                />
              </div>
            </ListItem>
            <ListItem>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography sx={{color: balanceColor}}>Use Balance</Typography>
                <Switch checked={mintNew} onChange={mintNewChange} />
                <Typography sx={{color: mintColor}}>Mint New</Typography>
              </Stack>
              <TextField
                label="Amount"
                variant="outlined"
                id="amount"
                sx={{ m: 1, width: "60%" }}
                value={distributeAmount}
                onChange={(e) => setDistributeAmount(e.target.value)}
              />
              <Button
                onClick={() => Distribute()}
                disabled={isDistributing}
                variant="contained"
                sx={{ m: 1 }}
              >
                {isDistributing ? <CircularProgress size={26} /> : "Distribute"}
              </Button>
            </ListItem>
          </List>
          <Snackbar
            open={showSendThanksSuccess}
            autoHideDuration={5000}
            onClose={handleCloseSnack}
          >
            <Alert onClose={handleCloseSnack} severity="success">
              Thanks tokens transferred!
            </Alert>
          </Snackbar>
        </Box>
      </div>
    );
  } else {
    return <div></div>;
  }
};

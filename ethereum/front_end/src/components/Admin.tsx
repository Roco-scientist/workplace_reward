import { useEthers, useCall, useContractFunction } from "@usedapp/core";
import { constants } from "ethers";
import { Box, Button, CircularProgress, List, ListItem, TextField } from "@mui/material";
import { useState } from "react";
import { SwapContract, BoxHeaderStyle, BoxContainerStyle } from "./Common";

export const Admin = () => {
  const swapContract = SwapContract();

  const { account } = useEthers();
  const accountAddress = account ? account : constants.AddressZero;

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

  const [formData, setFormData] = useState({
    newAddress: "",
  });

  const { send: addAddress, state: addAddressState } = useContractFunction(
    swapContract,
    "addAddress",
    {
      transactionName: "Add new address to the contract",
    }
  );

  const isAddingAddress =
    addAddressState.status === "Mining" ||
    addAddressState.status === "PendingSignature";
  // Fucntion to add a users address to the swap contract to allow sending and receiving
  // of thanks and rewards tokens
  const AddUser = () => {
    addAddress(formData.newAddress);
  };

  const { send: distributeThanks, state: distributeThanksState } = useContractFunction(
    swapContract,
    "distribute",
    {
      transactionName: "Distribute thanks tokens",
    }
  );

  const isDistributing =
    distributeThanksState.status === "Mining" ||
    distributeThanksState.status === "PendingSignature";
  // Fucntion to add a users address to the swap contract to allow sending and receiving
  // of thanks and rewards tokens
  const Distribute = () => {
    distributeThanks();
  };

  if (adminAddress === accountAddress) {
    return (
      <div>
        <Box sx={BoxContainerStyle}>
          <Box sx={BoxHeaderStyle}>Admin Activities</Box>
          <List>
          <ListItem divider>
            <TextField
              label="New user address"
              variant="outlined"
              id="newAddress"
              sx={{ m: 1, width: "97%" }}
              value={formData.newAddress}
              onChange={(e) =>
                setFormData({ ...formData, newAddress: e.target.value })
              }
            />
            <Button onClick={() => AddUser()} disabled={isAddingAddress}>
              {isAddingAddress ? <CircularProgress size={26} /> : "Submit"}
            </Button>
            </ListItem>
            <Button onClick={() => Distribute()} disabled={isDistributing} variant="contained">
              {isDistributing ? <CircularProgress size={26} /> : "Distribute"}
            </Button>
          </List>
        </Box>
      </div>
    );
  } else {
    return <div></div>;
  }
};

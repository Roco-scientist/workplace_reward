import { useEthers, useCall, useContractFunction } from "@usedapp/core";
import { constants } from "ethers";
import { Box, Button, TextField } from "@mui/material";
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

  // Fucntion to add a users address to the swap contract to allow sending and receiving
  // of thanks and rewards tokens
  const AddUser = () => {
    const { send } = useContractFunction(swapContract, "addAddress", {
      transactionName: "NewAddress",
    });
    send.arguments(formData.newAddress);
  };

  if (adminAddress === accountAddress) {
    return (
      <div>
        <Box sx={BoxContainerStyle}>
          <Box sx={BoxHeaderStyle}>Admin Activities</Box>
          <form>
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
            <Button onClick={() => AddUser()}>
              Submit
            </Button>
          </form>
        </Box>
      </div>
    );
  } else {
    return <div></div>;
  }
};

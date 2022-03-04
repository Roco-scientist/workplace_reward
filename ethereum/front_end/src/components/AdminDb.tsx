import {
  useEthers,
  useCall,
} from "@usedapp/core";
import { constants } from "ethers";
import {
  Box,
  List,
  ListItem,
} from "@mui/material";
import {
  BoxHeaderStyle,
  BoxContainerStyle,
  SwapContract,
} from "./Common";
import { AdminPw } from "./AdminPw"

export const AdminDb = () => {
  // retrieve the account which is logged in and set the address to zeros if it is not logged in
  const { account } = useEthers();
  const accountAddress = account ? account : constants.AddressZero;

  // Get the owner of the swap contract (adminAddress)
  let adminAddressResult = useCall({
    contract: SwapContract(),
    method: "owner",
    args: [],
  });

  const adminAddress = adminAddressResult
    ? adminAddressResult.value
      ? adminAddressResult.value[0]
      : constants.AddressZero
    : constants.AddressZero;

  // If the logged in user is the admin, show this form
  if (
    adminAddress === accountAddress &&
    accountAddress !== constants.AddressZero
  ) {
    return (
      <div>
        <Box sx={BoxContainerStyle}>
          <Box sx={BoxHeaderStyle}>Admin DB Activities</Box>
          <List>
            <ListItem divider>
              <AdminPw />
            </ListItem>
          </List>
        </Box>
      </div>
    );
  } else {
    return <div></div>;
  }
};

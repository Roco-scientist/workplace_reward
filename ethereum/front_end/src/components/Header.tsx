import { useEthers } from "@usedapp/core";
import { Button, Stack } from "@mui/material";
import { styled } from "@mui/system";
import { useState } from "react";
import { constants } from "ethers";
import { User } from "./Common";

const StyledHeader = styled("div")({
  padding: 8,
  marginRight: "5%",
  display: "flex",
  justifyContent: "flex-end",
});

export const Header = () => {
  const { account, activateBrowserWallet, deactivate } = useEthers();
  const accountAddress = account ? account : constants.AddressZero;

  const [isRegistered, setIsRegisterd] = useState(false);
  fetch("http://localhost:3080/api/users/all?accountAddress=" + accountAddress)
    .then((response) => response.json())
    .then((response: User[]) => {
      if (account) {
        const accountUser = response.filter((user) => user.address === account);
        if (accountUser.length > 0) {
          setIsRegisterd(true);
        } else {
          setIsRegisterd(false);
        }
      } else {
        setIsRegisterd(false);
      }
    });

  const isConnected = account !== undefined;

  return (
    <StyledHeader>
      <Stack direction="row" spacing={2}>
        {!isRegistered && isConnected ? <Button variant="contained">Register</Button> : <div></div>}
        {isConnected ? (
          <Button variant="contained" onClick={deactivate}>
            Disconnect
          </Button>
        ) : (
          <Button variant="contained" onClick={() => activateBrowserWallet()}>
            Connect
          </Button>
        )}
      </Stack>
    </StyledHeader>
  );
};

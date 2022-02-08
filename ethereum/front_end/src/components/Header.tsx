import { useEthers } from "@usedapp/core";
import Button from "@mui/material/Button";
import { styled } from "@mui/system";

const StyledHeader = styled("div")({
  padding: 8,
  marginRight: "5%",
  display: "flex",
  justifyContent: "flex-end",
});

export const Header = () => {
  const { account, activateBrowserWallet, deactivate } = useEthers();

  const isConnected = account !== undefined;

  return (
    <StyledHeader>
      {isConnected ? (
        <Button variant="contained" onClick={deactivate}>
          Disconnect
        </Button>
      ) : (
        <Button variant="contained" onClick={() => activateBrowserWallet()}>
          Connect
        </Button>
      )}
    </StyledHeader>
  );
};

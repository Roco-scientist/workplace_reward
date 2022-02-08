import { useEthers } from "@usedapp/core";
import Button from "@mui/material/Button";
import { styled } from "@mui/system";

const StyledHeader = styled("div")({
  color: "aliceblue",
  padding: 8,
  borderRadius: 4,
  display: "flex",
  justifyContent: "flex-end",
});

export const Header = () => {
  const { account, activateBrowserWallet, deactivate } = useEthers();

  const isConnected = account !== undefined;

  return (
    <StyledHeader>
      {isConnected ? (
        <Button variant="outlined" onClick={deactivate}>
          Disconnect
        </Button>
      ) : (
        <Button variant="outlined" onClick={() => activateBrowserWallet()}>
          Connect
        </Button>
      )}
    </StyledHeader>
  );
};

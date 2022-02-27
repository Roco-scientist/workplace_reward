import {
  useCall,
  useCalls,
  useEthers,
  useToken,
  useTokenBalance,
} from "@usedapp/core";
import { BigNumber, constants } from "ethers";
import { Box, List, ListItem, ListItemText, Stack } from "@mui/material";
import {
  BoxContainerStyle,
  BoxHeaderStyle,
  EotmContract,
  RewardsContract,
  ThanksContract,
} from "./Common";
import { formatUnits } from "@ethersproject/units";

export const Balances = () => {
  const thanksContract = ThanksContract();
  const rewardsContract = RewardsContract();

  const thanksPausedResult = useCall({
    contract: thanksContract,
    method: "paused",
    args: [],
  });

  const thanksPaused: boolean = thanksPausedResult
    ? thanksPausedResult.value
      ? thanksPausedResult.value[0]
      : false
    : false;

  const rewardsPausedResult = useCall({
    contract: rewardsContract,
    method: "paused",
    args: [],
  });

  const rewardsPaused: boolean = rewardsPausedResult
    ? rewardsPausedResult.value
      ? rewardsPausedResult.value[0]
      : false
    : false;

  // get account and chain id of the connected wallet
  const { account } = useEthers();
  const accountAddress = account ? account : constants.AddressZero;

  const connected = account !== undefined ? "(Connected)" : "(Not connected)";

  // Get the token balances to display
  const thanksBalance_start = useTokenBalance(
    thanksContract.address,
    accountAddress
  );
  const thanksBalance = thanksBalance_start
    ? thanksBalance_start
    : BigNumber.from(0);

  const rewardsBalance_start = useTokenBalance(
    rewardsContract.address,
    accountAddress
  );
  const rewardsBalance = rewardsBalance_start
    ? rewardsBalance_start
    : BigNumber.from(0);

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

  const cids = useEotmAccrued();
  // console.log("Uris: " + uris);

  return (
    <div>
      <Box sx={BoxContainerStyle}>
        <Box sx={BoxHeaderStyle}>Current holdings {connected}</Box>
        <List>
          <ListItem divider>
            <ListItemText
              primary={
                thanksPaused
                  ? "Thank you tokens (inactive)"
                  : "Thank you tokens (active)"
              }
              secondary={formatUnits(thanksBalance, thanksDecimals)}
            />
          </ListItem>
          <ListItem divider>
            <ListItemText
              primary={
                rewardsPaused
                  ? "Reward tokens (inactive)"
                  : "Reward tokens (active)"
              }
              secondary={formatUnits(rewardsBalance, rewardsDecimals)}
            />
          </ListItem>
          <ListItem>
            <Stack spacing={2}>
              {cids.map((cid, indx) => {
                return (
                  <ListItemText
                    key={cid + indx}
                    primary="Employee of the month"
                    secondary={<a href={"ipfs://" + cid} target="_blank" rel="noreferrer">NFT</a>}
                  />
                );
              })}
            </Stack>
          </ListItem>
        </List>
      </Box>
    </div>
  );
};

const useEotmAccrued = () => {
  // get account and chain id of the connected wallet
  const { account } = useEthers();
  const accountAddress = account ? account : constants.AddressZero;

  const eotmContract = EotmContract();

  const ownerQtyResult = useCall({
    contract: eotmContract,
    method: "balanceOf",
    args: [accountAddress],
  });

  const ownerQty = ownerQtyResult
    ? ownerQtyResult.value
      ? ownerQtyResult.value?.[0].toNumber()
      : 0
    : 0;

  const indexes = Array.from(Array(ownerQty).keys());
  const ownerCalls =
    indexes.map((idx) => ({
      contract: eotmContract,
      method: "tokenOfOwnerByIndex",
      args: [accountAddress, idx.toString()],
    })) ?? [];

  const ownerTokenIdsResults = useCalls(ownerCalls);

  const ownedEotms: number[] = [];

  ownerTokenIdsResults.forEach((result, idx) => {
    if (result && result.error) {
      console.error(
        `Error encountered calling 'ownerOf' on ${ownerCalls[idx]?.contract.address}: ${result.error.message}`
      );
    }
    const tokenId = result?.value?.[0];
    if (tokenId) {
      ownedEotms.push(tokenId);
    }
  });

  const eotmCalls =
    ownedEotms.map((tokenId) => ({
      contract: eotmContract,
      method: "tokenURI",
      args: [tokenId.toString()],
    })) ?? [];

  const eotmUriResults = useCalls(eotmCalls);

  const cids: string[] = [];
  eotmUriResults.forEach((result, idx) => {
    if (result && result.error) {
      console.error(
        `Error encountered calling 'ownerOf' on ${eotmCalls[idx]?.contract.address}: ${result.error.message}`
      );
    }
    const uri = result?.value?.[0];
    if (uri) {
      const cid = uri.replace("ipfs://", "");
      cids.push(cid);
    }
  });

  // console.log(cids);
  // cids.forEach((cid) => {
  //   fetch("http://localhost:3080/api/getnft?cid=" + cid)
  //     .then((response) => response.json())
  //     .then((response) => console.log(response));
  // });

  return cids;
};

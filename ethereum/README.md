# Contract code

## Requirements

- python 3+
- [pipx](https://pypa.github.io/pipx/installation/)
- brownie
  - `pipx install eth-brownie`
- [Solidity compiler](https://docs.soliditylang.org/en/v0.8.11/installing-solidity.html)
- [Ganache](https://trufflesuite.com/ganache/)
- Metamask wallet plugin to interact with the front end
  - [For Chrome](https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn)
  - [For firefox](https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/)
- To enable further use, the deployer needs to connect to the front end in order to:
  - Add the address to the contract
  - Distribute thanks coins to the added address

## Compile Solidity Contracts

`brownie compile`

## Deploy

Create a .env file holding the private account address  
  
`brownie run ./scripts/deployRewards.py --network mainnet`


## Unit Tests

Tests found in [test folder](./tests)  
  
`brownie test`

## Deployment build tests

### Locally on gnache

`brownie run ./scripts/deployRewards.py`

### Other testnets

`brownie run ./scripts/deployRewards.py --network rinkebey`  
`brownie run ./scripts/deployRewards.py --network ropsten`

### Deployed  
2022-02-07 on ropsten test network:  
- [Deploy Address](https://ropsten.etherscan.io/address/0x839901c21D20316b0DDcA205AAe53A1EbB886cf4)
- [Swap](https://ropsten.etherscan.io/address/0xd9398D03794919215A2f7191e1FaBb4C9EeCBfdD)
- [Thank you token](https://ropsten.etherscan.io/address/0x131432D246122B94FeD14873C2c05A154EC93122)
- [Reward token](https://ropsten.etherscan.io/address/0x808cF232F973CF0bBB480C27d476E6C5581bbC62)
  
Costs:
- Deployment
  - 0.121760029128948 ($367) eth with gas at ~50 gwei  
- AddAddress
  - 0.000165667866 eth
- Distribute
  - 0.00025524 eth
- Send Thanks
  - Approve: 0.00005463063 eth
  - Send: 0.000184344972 eth

  
## Run front end

Make sure that there has been at least one deployment on a non-local blockchain.  
  
### Locally

#### Start the api backend
```
cd api
npm start
```

#### Start the webpage
```
cd front_end
npm start
```

## Tip the creator

#### In order to tip, send crypto to one of the following addresses  
- ETH (Ethereum):
  - 0x30D4C0b1cBBa1A31F04d921fCA45eb0edDC7A367
- AVAX (Avalanche):
  - 0x30d4c0b1cbba1a31f04d921fca45eb0eddc7a367

## Current front-end screenshot

![Thanks](../thanks.png)

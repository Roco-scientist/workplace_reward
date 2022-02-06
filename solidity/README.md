# contract code WORK IN PROGRESS

## Requirements

- python 3+
- [pipx](https://pypa.github.io/pipx/installation/)
- brownie
  - `pipx install eth-brownie`
- [Solidity compiler](https://docs.soliditylang.org/en/v0.8.11/installing-solidity.html)
- [Ganache](https://trufflesuite.com/ganache/)

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
2022-02-06 on ropsten test network:  
- [Deploy Address](https://ropsten.etherscan.io/address/0x839901c21D20316b0DDcA205AAe53A1EbB886cf4)
- [Swap](https://ropsten.etherscan.io/address/0x7b652a331d18435ec0a60bbde921b694e33dc8ea)
- [Thank you token](https://ropsten.etherscan.io/address/0xc77e0748a0b611c7af08a72ff855c5a431bb4a6c)
- [Reward token](https://ropsten.etherscan.io/address/0x3d5597e5325eceb2871a6132e680e0cccc61204f)

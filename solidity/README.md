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
2022-02-07 on ropsten test network:  
- [Deploy Address](https://ropsten.etherscan.io/address/0x839901c21D20316b0DDcA205AAe53A1EbB886cf4)
- [Swap](https://ropsten.etherscan.io/address/0xd9398D03794919215A2f7191e1FaBb4C9EeCBfdD)
- [Thank you token](https://ropsten.etherscan.io/address/0x131432D246122B94FeD14873C2c05A154EC93122)
- [Reward token](https://ropsten.etherscan.io/address/0x808cF232F973CF0bBB480C27d476E6C5581bbC62)

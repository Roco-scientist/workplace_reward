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
  
`brownie run ./scripts/DeployGlue.py --network mainnet`


## Unit Tests

Tests found in [test folder](./tests)  
  
`brownie test`

## Deployment build tests

### Locally on gnache

`brownie run ./scripts/DeployGlue.py`

### Other testnets

`brownie run ./scripts/DeployGlue.py --network rinkebey`  
`brownie run ./scripts/DeployGlue.py --network ropsten`

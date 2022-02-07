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

`brownie run ./scripts/deployRewards.py --update_front_end --network rinkebey`  
`brownie run ./scripts/deployRewards.py --update_front_end --network ropsten`

### Deployed  
2022-02-07 on ropsten test network:  
- [Deploy Address](https://ropsten.etherscan.io/address/0x839901c21D20316b0DDcA205AAe53A1EbB886cf4)
- [Swap](https://ropsten.etherscan.io/address/0xd9398D03794919215A2f7191e1FaBb4C9EeCBfdD)
- [Thank you token](https://ropsten.etherscan.io/address/0x131432D246122B94FeD14873C2c05A154EC93122)
- [Reward token](https://ropsten.etherscan.io/address/0x808cF232F973CF0bBB480C27d476E6C5581bbC62)
  
Deployment cost: 0.121760029128948 ($367) eth with gas at ~50 gwei  
  
## Run front end

Make sure that there has been at least one deployment and the --update_front_end flag on brownie run was called.  
  
### Locally

```
cd front_end
yarn start
```

## Tip the creator

Send:  
- Ether:
  - 0x30D4C0b1cBBa1A31F04d921fCA45eb0edDC7A367

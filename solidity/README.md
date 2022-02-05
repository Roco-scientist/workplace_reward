# contract code WORK IN PROGRESS

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

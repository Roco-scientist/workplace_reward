# contract code WORK IN PROGRESS

## Deploy

Create a .env file holding the private account address  
  
`brownie run ./scripts/DeployGlue.py --network mainnet`


## Test

### Locally on gnache

`brownie run ./scripts/DeployGlue.py`

### Other testnets

`brownie run ./scripts/DeployGlue.py --network rinkebey`  
`brownie run ./scripts/DeployGlue.py --network ropsten`

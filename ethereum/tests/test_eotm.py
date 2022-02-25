from scripts.helpful_scripts import get_account, LOCAL_BLOCKCHAIN_ENVIRONMENTS
from scripts import deployNFTs
from brownie import network, accounts, exceptions
import pytest

def test_nft():
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("only for local testing")
    account = get_account()
    destination_account = accounts[1]
    eotm = deployNFTs.deploy_EOTM(account)
    eotm.safeMint(destination_account, "ipfs://QmTELAJwk3PoCyvFtGHBnMuFXZJykKbMDqVqBcsoQimhpq", {"from": account})
    assert eotm.tokenURI(0) ==  "ipfs://QmTELAJwk3PoCyvFtGHBnMuFXZJykKbMDqVqBcsoQimhpq"
    assert False


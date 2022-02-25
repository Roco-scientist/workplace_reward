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
    # Check transfer
    assert eotm.ownerOf(0) == destination_account
    # Check authority
    with pytest.raises(exceptions.VirtualMachineError):
        eotm.safeMint(account, "ipfs://QmTELAJwk3PoCyvFtGHBnMuFXZJykKbMDqVqBcsoQimhpq", {"from": destination_account})
    # Make sure the uri is the same
    assert eotm.tokenURI(0) ==  "ipfs://QmTELAJwk3PoCyvFtGHBnMuFXZJykKbMDqVqBcsoQimhpq"
    # Check transfer
    with pytest.raises(exceptions.VirtualMachineError):
        eotm.safeTransferFrom(destination_account, account, 0, {"from": account})
    eotm.approve(account, 0, {"from": destination_account})
    eotm.safeTransferFrom(destination_account, account, 0, {"from": account})
    assert eotm.ownerOf(0) == account
    eotm.safeTransferFrom(account, destination_account, 0, {"from": account})
    assert eotm.ownerOf(0) == destination_account

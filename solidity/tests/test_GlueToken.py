from scripts.helpful_scripts import get_account, LOCAL_BLOCKCHAIN_ENVIRONMENTS
from scripts.DeployGlue import deploy_token, DECIMALS
from brownie import network, accounts, exceptions
import pytest


def test_send():
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("only for local testing")
    account = get_account()
    transfer_amount = 10 * DECIMALS
    transfer_to_address = accounts[1]
    glue = deploy_token()
    original_amt = glue.balanceOf(account)
    glue.transfer(transfer_to_address, transfer_amount, {"from": account})
    assert glue.balanceOf(transfer_to_address) == transfer_amount
    assert glue.balanceOf(account) == original_amt - transfer_amount


def test_authority():
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("only for local testing")
    unauthorized_account = accounts[1]
    transfer_to_address = accounts[2]
    transfer_amount = 10 * DECIMALS
    glue = deploy_token()
    with pytest.raises(exceptions.VirtualMachineError):
        glue.transfer(transfer_to_address, transfer_amount, {"from": unauthorized_account})

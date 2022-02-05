from scripts.helpful_scripts import get_account, LOCAL_BLOCKCHAIN_ENVIRONMENTS
from scripts import deployRewards
from brownie import network, accounts, exceptions
import pytest

DECIMALS = deployRewards.DECIMALS
SUPPLY = 10**6 * DECIMALS

def finish_send(account, token_account):
    transfer_amount = 10 * DECIMALS
    transfer_to_address = accounts[1]
    original_amt = token_account.balanceOf(account)
    token_account.transfer(transfer_to_address, transfer_amount, {"from": account})
    assert token_account.balanceOf(transfer_to_address) == transfer_amount
    assert token_account.balanceOf(account) == original_amt - transfer_amount


def test_send_rewards():
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("only for local testing")
    account = get_account()
    rewards = deployRewards.deploy_rewards(SUPPLY, account)
    finish_send(account, rewards)

def test_send_thanks():
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("only for local testing")
    account = get_account()
    thanks = deployRewards.deploy_thanks(SUPPLY, account)
    finish_send(account, thanks)


def test_authority():
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("only for local testing")
    authorized_account = get_account()
    unauthorized_account = accounts[1]
    transfer_to_address = accounts[2]
    transfer_amount = 10 * DECIMALS
    thanks = deployRewards.deploy_thanks(SUPPLY, authorized_account)
    rewards = deployRewards.deploy_rewards(SUPPLY, authorized_account)
    with pytest.raises(exceptions.VirtualMachineError):
        thanks.transfer(transfer_to_address, transfer_amount, {"from": unauthorized_account})
    with pytest.raises(exceptions.VirtualMachineError):
        rewards.transfer(transfer_to_address, transfer_amount, {"from": unauthorized_account})

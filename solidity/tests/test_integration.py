from scripts.helpful_scripts import LOCAL_BLOCKCHAIN_ENVIRONMENTS
from scripts import deployRewards
from brownie import network, accounts, exceptions
import pytest

DECIMALS = deployRewards.DECIMALS
SUPPLY = 10**6 * DECIMALS

def test_all():
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("only for local testing")
    deployer_account = accounts[0]
    user_1 = accounts[1]
    user_2 = accounts[2]
    swap_contract, rewards_contract, thanks_contract = deployRewards.run_all()
    swap_contract.addAddress(user_1, {"from": deployer_account})
    swap_contract.addAddress(user_2, {"from": deployer_account})
    swap_contract.distribute({"from": deployer_account})
    print(f"""User 1:\n\tthanks:{thanks_contract.balanceOf(user_1) / DECIMALS}\n\trewards:{rewards_contract.balanceOf(user_1) / DECIMALS}\nUser 2:\n\tthanks:{thanks_contract.balanceOf(user_2) / DECIMALS}\n\trewards:{rewards_contract.balanceOf(user_2) / DECIMALS}""")
    thanks_contract.approve(swap_contract.address, 10 * DECIMALS, {"from": user_1})
    swap_contract.sendThanks(10 * DECIMALS, user_2, {"from": user_1})
    print("Thanks sent")
    print(f"""User 1:\n\tthanks:{thanks_contract.balanceOf(user_1) / DECIMALS}\n\trewards:{rewards_contract.balanceOf(user_1) / DECIMALS}\nUser 2:\n\tthanks:{thanks_contract.balanceOf(user_2) / DECIMALS}\n\trewards:{rewards_contract.balanceOf(user_2) / DECIMALS}""")

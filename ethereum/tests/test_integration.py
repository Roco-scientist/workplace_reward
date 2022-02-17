from scripts.helpful_scripts import LOCAL_BLOCKCHAIN_ENVIRONMENTS
from scripts import deployRewards
from brownie import network, accounts, exceptions
import pytest

DECIMALS = deployRewards.DECIMALS
SUPPLY = 10**6 * DECIMALS

def test_all():
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("only for local testing")
    # create accounts
    deployer_account = accounts[0]
    user_1 = accounts[1]
    user_2 = accounts[2]
    user_3 = accounts[3]

    # Deploy tokens and swap contracts with deployer account
    swap_contract, rewards_contract, thanks_contract = deployRewards.run_all()

    # Evenly distribute thanks tokens to user_1 and user_2
    swap_contract.distribute([user_1, user_2], (SUPPLY / 2) - 1000, {"from": deployer_account})
    print(f"""User 1:\n\tthanks:{thanks_contract.balanceOf(user_1) / DECIMALS}\n\trewards:{rewards_contract.balanceOf(user_1) / DECIMALS}\nUser 2:\n\tthanks:{thanks_contract.balanceOf(user_2) / DECIMALS}\n\trewards:{rewards_contract.balanceOf(user_2) / DECIMALS}""")

    # Send 10 thanks tokens from user 1 to user 2
    thanks_contract.approve(swap_contract.address, 10 * DECIMALS, {"from": user_1})
    user_1_original_thanks_qty = thanks_contract.balanceOf(user_1)
    swap_contract.sendThanks(10 * DECIMALS, user_2, 1, {"from": user_1})
    print("Thanks sent")
    print(f"""User 1:\n\tthanks:{thanks_contract.balanceOf(user_1) / DECIMALS}\n\trewards:{rewards_contract.balanceOf(user_1) / DECIMALS}\nUser 2:\n\tthanks:{thanks_contract.balanceOf(user_2) / DECIMALS}\n\trewards:{rewards_contract.balanceOf(user_2) / DECIMALS}""")
    # Test for proper thanks sent and rewards received
    assert thanks_contract.balanceOf(user_1) == user_1_original_thanks_qty - 10 * DECIMALS, "Thanks amount is off"
    assert rewards_contract.balanceOf(user_2) / DECIMALS == 10, "Rewards send is off"

    # test authority of using swap contract
    with pytest.raises(exceptions.VirtualMachineError):
        swap_contract.distribute([user_3], 100, {"from": user_3})

    # test sending Eth and removing eth
    user_1.transfer(swap_contract.address, "1 ether")
    assert swap_contract.getBalance({"from": deployer_account}) == 1 * 10**18, "Ether was not transferred to the Swap contract"
    # test authority to remove Eth
    with pytest.raises(exceptions.VirtualMachineError):
        swap_contract.withdrawEth({"from": user_3})
    # test removing eth
    swap_contract.withdrawEth({"from": deployer_account})
    assert swap_contract.getBalance({"from": deployer_account}) == 0, "Ether was not transferred out of the Swap contract"

    # test removing tokens authority
    with pytest.raises(exceptions.VirtualMachineError):
        swap_contract.withdrawToken(rewards_contract.address, 10 * DECIMALS, {"from": user_3})
    with pytest.raises(exceptions.VirtualMachineError):
        swap_contract.withdrawToken(thanks_contract.address, 10 * DECIMALS, {"from": user_3})


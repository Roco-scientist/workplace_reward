from brownie import RewardsToken, ThankYouToken, Swap, network
from scripts.helpful_scripts import get_account, LOCAL_BLOCKCHAIN_ENVIRONMENTS
import yaml
import json
from pathlib import Path
import shutil

NUM_DECIMALS = 2
DECIMALS = 10 ** NUM_DECIMALS
INITIAL_SUPPLY = 10 ** 6


def deploy_rewards(supply: int, account):
    rewards_contract = RewardsToken.deploy(supply, {"from": account})
    print(
        f"Contract deployed {rewards_contract.balanceOf(account) / DECIMALS} reward tokens to {rewards_contract.address}"
    )
    return rewards_contract


def deploy_thanks(supply: int, account):
    thanks_contract = ThankYouToken.deploy(supply, {"from": account})
    print(
        f"Contract deployed {thanks_contract.balanceOf(account) / DECIMALS} thanks tokens to {thanks_contract.address}"
    )
    return thanks_contract


def deploy_swap(account, rewards_contract, thanks_contract):
    swap_contract = Swap.deploy(
        rewards_contract.address, thanks_contract.address, {"from": account}
    )
    return swap_contract


def transfer_coins_to_swap(account, rewards_contract, thanks_contract, swap_contract):
    rewards_contract.transfer(
        swap_contract.address, rewards_contract.balanceOf(account)
    )
    tx = thanks_contract.transfer(
        swap_contract.address, thanks_contract.balanceOf(account)
    )
    tx.wait(1)
    print(
        f"Swap contract now contains {rewards_contract.balanceOf(swap_contract.address) / DECIMALS} rewards and {thanks_contract.balanceOf(swap_contract.address) / DECIMALS} thanks"
    )


def update_front_end():
    front_end_map = Path("./front_end/src/contract_map.json")
    contracts_map = Path("./build/deployments/map.json")
    shutil.copy(contracts_map, front_end_map)

    front_end_swap = Path("./front_end/src/Swap.json")
    contracts_swap = Path("./build/contracts/Swap.json")
    shutil.copy(contracts_swap, front_end_swap)

    front_end_thanks = Path("./front_end/src/ThankYouToken.json")
    contracts_thanks = Path("./build/contracts/ThankYouToken.json")
    shutil.copy(contracts_thanks, front_end_thanks)

    front_end_rewards = Path("./front_end/src/RewardsToken.json")
    contracts_rewards = Path("./build/contracts/RewardsToken.json")
    shutil.copy(contracts_rewards, front_end_rewards)

    print("Front end updated")


def run_all():
    supply = INITIAL_SUPPLY * DECIMALS
    account = get_account()
    rewards_contract = deploy_rewards(supply, account)
    thanks_contract = deploy_thanks(supply, account)
    swap_contract = deploy_swap(account, rewards_contract, thanks_contract)
    transfer_coins_to_swap(account, rewards_contract, thanks_contract, swap_contract)
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        update_front_end()
    return swap_contract, rewards_contract, thanks_contract


def main():
    run_all()

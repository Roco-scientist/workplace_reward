from brownie import RewardToken, ThankYouToken, Swap, network
from scripts.helpful_scripts import get_account, LOCAL_BLOCKCHAIN_ENVIRONMENTS
import yaml
import json
from pathlib import Path
import shutil

NUM_DECIMALS = 2
DECIMALS = 10 ** NUM_DECIMALS
INITIAL_SUPPLY = 10 ** 6


def deploy_rewards(account):
    rewards_contract = RewardToken.deploy({"from": account})
    return rewards_contract


def deploy_thanks(account):
    thanks_contract = ThankYouToken.deploy({"from": account})
    return thanks_contract


def deploy_swap(account, rewards_contract, thanks_contract, supply):
    swap_contract = Swap.deploy(
        rewards_contract.address, thanks_contract.address, {"from": account}
    )
    rewards_contract.grantRole(rewards_contract.MINTER_ROLE(), swap_contract.address, {"from": account})
    thanks_contract.grantRole(thanks_contract.MINTER_ROLE(), swap_contract.address, {"from": account})
    swap_contract.addMintedTokens(supply, supply, {"from": account})
    print(
        f"Swap contract now contains {rewards_contract.balanceOf(swap_contract.address) / DECIMALS} rewards and {thanks_contract.balanceOf(swap_contract.address) / DECIMALS} thanks"
    )
    return swap_contract


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

    front_end_rewards = Path("./front_end/src/RewardToken.json")
    contracts_rewards = Path("./build/contracts/RewardToken.json")
    shutil.copy(contracts_rewards, front_end_rewards)

    print("Front end updated")


def run_all():
    supply = INITIAL_SUPPLY * DECIMALS
    account = get_account()
    rewards_contract = deploy_rewards(account)
    thanks_contract = deploy_thanks(account)
    swap_contract = deploy_swap(account, rewards_contract, thanks_contract, supply)
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        update_front_end()
    return swap_contract, rewards_contract, thanks_contract


def main():
    run_all()

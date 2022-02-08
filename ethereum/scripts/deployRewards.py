from brownie import RewardsToken, ThankYouToken, Swap
from scripts.helpful_scripts import get_account
import yaml
import json
import argparse

DECIMALS = 10 ** 2


def arguments():
    parser = argparse.ArgumentParser(description="Deployment of worker rewards")
    parser.add_argument("update_front_end", action="store_true", default=False, help="Update the front end with contract information")
    return parser.parse_args()


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
    with open("brownie-config.yaml", "r") as brownie_config:
        config_dict = yaml.load(brownie_config, Loader=yaml.FullLoader)
        with open("./front_end/src/browie-config.json", "w") as brownie_config_json:
            json.dump(config_dict, brownie_config_json)
    print("Front end updated")


def run_all(update_html=False):
    supply = 10 ** 6 * DECIMALS
    account = get_account()
    rewards_contract = deploy_rewards(supply, account)
    thanks_contract = deploy_thanks(supply, account)
    swap_contract = deploy_swap(account, rewards_contract, thanks_contract)
    transfer_coins_to_swap(account, rewards_contract, thanks_contract, swap_contract)
    if update_html:
        update_front_end()
    return swap_contract, rewards_contract, thanks_contract


def main():
    args = arguments()
    run_all(args.update_front_end)
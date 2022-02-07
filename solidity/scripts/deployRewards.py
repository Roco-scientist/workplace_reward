from brownie import RewardsToken, ThankYouToken, Swap
from scripts.helpful_scripts import get_account

DECIMALS = 10 ** 2


def deploy_rewards(supply: int, account):
    rewards_contract = RewardsToken.deploy(supply, {"from": account})
    print(
        f"Contract deployed {rewards_contract.balanceOf(account) / DECIMALS} reward tokens to {rewards_contract.address}"
    )
    return rewards_contract


def deploy_thanks(supply: int, account):
    thanks_contract = ThankYouToken.deploy(supply, {"from": account})
    print(
        f"Contract deployed {thanks_contract.balanceOf(account) / DECIMALS} reward tokens to {thanks_contract.address}"
    )
    return thanks_contract


def deploy_swap(account, rewards_contract, thanks_contract):
    swap_contract = Swap.deploy(rewards_contract.address, thanks_contract.address, {"from": account})
    return swap_contract


def transfer_coins_to_swap(account, rewards_contract, thanks_contract, swap_contract):
    rewards_contract.transfer(
        swap_contract.address, rewards_contract.balanceOf(account)
    )
    thanks_contract.transfer(swap_contract.address, thanks_contract.balanceOf(account))
    print(
        f"Swap contract now contains {rewards_contract.balanceOf(swap_contract.address) / DECIMALS} rewards and {thanks_contract.balanceOf(swap_contract.address) / DECIMALS} thanks"
    )


def run_all():
    supply = 10 ** 6 * DECIMALS
    account = get_account()
    rewards_contract = deploy_rewards(supply, account)
    thanks_contract = deploy_thanks(supply, account)
    swap_contract = deploy_swap(account, rewards_contract, thanks_contract)
    transfer_coins_to_swap(account, rewards_contract, thanks_contract, swap_contract)
    return swap_contract, rewards_contract, thanks_contract


def main():
    run_all()

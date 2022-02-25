from brownie import EmployeeOfTheMonth, network
from scripts.helpful_scripts import get_account, LOCAL_BLOCKCHAIN_ENVIRONMENTS

def deploy_EOTM(account):
    eotm_nft = EmployeeOfTheMonth.deploy({"from": account})
    return eotm_nft


def update_front_end():
    pass


def main():
    account = get_account()
    deploy_EOTM(account)
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        update_front_end()

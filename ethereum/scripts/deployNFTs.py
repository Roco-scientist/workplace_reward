from brownie import EmployeeOfTheMonth, network
from scripts.helpful_scripts import get_account, LOCAL_BLOCKCHAIN_ENVIRONMENTS
from pathlib import Path
import shutil

def deploy_EOTM(account):
    eotm_nft = EmployeeOfTheMonth.deploy({"from": account})
    return eotm_nft


def update_front_end():
    front_end_map = Path("./front_end/src/contract_map.json")
    contracts_map = Path("./build/deployments/map.json")
    shutil.copy(contracts_map, front_end_map)

    front_end_eotm = Path("./front_end/src/EmployeeOfTheMonth.json")
    contracts_eotm = Path("./build/contracts/EmployeeOfTheMonth.json")
    shutil.copy(contracts_eotm, front_end_eotm)


def main():
    account = get_account()
    deploy_EOTM(account)
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        update_front_end()

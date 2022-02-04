from brownie import GlueToken
from scripts.helpful_scripts import get_account

DECIMALS = 10**18

def deploy_token():
    account = get_account()
    glue = GlueToken.deploy({"from": account})
    print(f"Contract deployed to {glue.address}")
    print(f"There is a balance of {glue.balanceOf(account) / DECIMALS} tokens")

def main():
    deploy_token()

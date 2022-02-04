from brownie import accounts, network, config

FORKED_LOCAL_ENFIVRONMENTS = ["mainnet-fork"]
LOCAL_BLOCKCHAIN_ENVIRONMENTS = ["development", "ganache-local"]

def get_account():
    if network.show_active() in LOCAL_BLOCKCHAIN_ENVIRONMENTS + FORKED_LOCAL_ENFIVRONMENTS:
        # brownie accounts new test
        # to create the account.  Paste private key
        # account = accounts.load("test")

        # Use ganache accounts
        return accounts[0]
    else:
        # with .env file and brownie-config.yaml
        # fix first
        return accounts.add(config["wallets"]["from_key"])

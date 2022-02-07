from brownie import Swap
import argparse

DECIMALS = 10 ** 18

def arguments():
    parser = argparse.ArgumentParser(description="Script to send thank you tokens from one address to another")
    parser.add_argument("to_address", type=str, required=True,  help="Address to send thanks to")
    parser.add_argument("from_address", type=str, required=True, help="Address to send thanks from")
    parser.add_argument("amt", type=str, required=True, help="Amount of thanks to send")
    parser.add_argument("swap_address", type=str, required=True, help="Address of the swap contract")
    return parser.parse_args()


def send_thanks(from_address, to_address, amount, swap_address):
    Swap.at(swap_address).send_thanks(to_address, amount * DECIMALS, {"from": from_address})


def main():
    args = arguments()
    send_thanks(args.from_address, args.to_address, args.amt, args.swap_address)

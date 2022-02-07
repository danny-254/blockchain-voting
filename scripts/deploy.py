from scripts.reusables import get_account
from brownie import President


candidates = ["Raila", "Ruto"]
voters = [
    "0x4b8e52Ff8fd48B03549BEf829A4aeDE16fDee735",
    "0x2d427221fEFFa01c968A206089E2D5d3E0F440A1",
    "0x7EDd5De806D888f5C033C733AF6612e21cE16593",
    "0x5BeA47ABb39F6eD08d480193ebc813dcB3B41C9B",
]


def deploy_voting():
    account = get_account()
    print(account)
    voting_system = President.deploy(candidates, voters, {"from": account})
    print("Voting Contract deployed")


def main():
    deploy_voting()

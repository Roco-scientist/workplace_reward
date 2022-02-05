// SPDX-License-Identifier: AGPL 3.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./RewardsToken.sol";
import "./ThankYouToken.sol";

contract Swap is Ownable {
    RewardsToken RewardsContract;
    ThankYouToken ThanksContract;
    address[] validRecipientAddresses;

    event Sent(address _from, address _to, uint256 _amount);

    constructor(address _rewardsAddress, address _thanksAddress) public {
        RewardsContract = RewardsToken(_rewardsAddress);
        ThanksContract = ThankYouToken(_thanksAddress);
    }

    // Adds user address to the contract.  This is to limit the addresses which can interact with the contract.  
    // Can only be added by the person that deploys the contract
    function addAddress(address newRecipientAddress) public onlyOwner{
        validRecipientAddresses.push(newRecipientAddress);
    }

    // Returns whether or not the user address has already been added to the contract
    function addressSetup(address userAddress) public returns(bool) {
        for (uint i=0; i < validRecipientAddresses.length; i++) {
            if (validRecipientAddresses[i] == userAddress) {
                return true;
            }
        }
        return false;
    }

    // Function which takes in a thank you token and send a reward token to the user indicated
    function sendThanks(uint256 amount, address toAddress) public {
        // make sure both sender and receiver were already added to the contract
        require(addressSetup(msg.sender), "User not yet setup");
        require(addressSetup(toAddress), "Recipient not yet setup");
        // Make sure there are enough coins in both the senders address and within the contract to send
        // and convert
        require(ThanksContract.balanceOf(msg.sender) >= amount, "Not enough thank yous to send");
        require(RewardsContract.balanceOf(address(this)) >= amount, "Not enough rewards to give out");
        // Make sure the sender is not sending a thank you to him/her self
        require(msg.sender != toAddress, "You cannot thank yourself");

        // Transfer the thank you token to the contract
        ThanksContract.transferFrom(msg.sender, address(this), amount);
        // Transfer the reward token to the thanked user
        RewardsContract.transferFrom(address(this), toAddress, amount);

        emit Sent(msg.sender, toAddress, amount);
    }

    // Redeem tokens for awards.  This still needs work
    function redeem(uint256 amount) public {
        require(addressSetup(msg.sender), "User not yet setup");
        require(RewardsContract.balanceOf(msg.sender) >= amount, "Trying to redeem more rewards than you are holding");

        RewardsContract.transferFrom(msg.sender, address(this), amount);
    }

    // Distribute the thank you tokens contained within the contract.  This equally distributes
    // any tokens to all added users.  This will be modified with better logic later
    function distribute() public onlyOwner {
        // Make sure there are users setup
        require(validRecipientAddresses.length > 0, "No recipient addresses added yet");

        // Determine how many thank you tokens to send to each user, then iterate and send
        uint eachShare = ThanksContract.balanceOf(address(this)) / validRecipientAddresses.length;
        for (uint256 userIndex; userIndex < validRecipientAddresses.length; userIndex++) {
            ThanksContract.transferFrom(address(this), validRecipientAddresses[userIndex], eachShare);
        }
    }

    // Below functions are meant to allow funding of the contract in order to pay for gas etc.
    // Allow any crypto sent to the contract to be removed
    function sendViaCall(address payable _to) public payable onlyOwner {
        // Call returns a boolean value indicating success or failure.
        // This is the current recommended method to use.
        (bool sent, bytes memory data) = _to.call{value: msg.value}("");
        require(sent, "Failed to send Ether");
    }

    // Function to receive Ether. msg.data must be empty
    receive() external payable {}

    // Fallback function is called when msg.data is not empty
    fallback() external payable {}

    // Get the balance of ether contained within the contract
    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}

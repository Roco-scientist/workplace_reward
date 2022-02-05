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

    function addressSetup(address userAddress) public returns(bool) {
        for (uint i=0; i < validRecipientAddresses.length; i++) {
            if (validRecipientAddresses[i] == userAddress) {
                return true;
            }
        }
        return false;
    }

    function sendThanks(uint256 amount, address toAddress) public {
        require(addressSetup(msg.sender), "User not yet setup");
        require(addressSetup(toAddress), "Recipient not yet setup");
        require(ThanksContract.balanceOf(msg.sender) >= amount, "Not enough thank yous to send");
        require(RewardsContract.balanceOf(address(this)) >= amount, "Not enough rewards to give out");
        require(msg.sender != toAddress, "You cannot thank yourself");

        ThanksContract.transferFrom(msg.sender, address(this), amount);
        RewardsContract.transferFrom(address(this), toAddress, amount);

        emit Sent(msg.sender, toAddress, amount);
    }

    function redeem(uint256 amount) public {
        require(addressSetup(msg.sender), "User not yet setup");
        require(RewardsContract.balanceOf(msg.sender) >= amount, "Trying to redeem more rewards than you are holding");

        RewardsContract.transferFrom(msg.sender, address(this), amount);
    }

    function distribute() public onlyOwner {
        require(validRecipientAddresses.length > 0, "No recipient addresses added yet");
        uint eachShare = ThanksContract.balanceOf(address(this)) / validRecipientAddresses.length;
        for (uint256 userIndex; userIndex < validRecipientAddresses.length; userIndex++) {
            ThanksContract.transferFrom(address(this), validRecipientAddresses[userIndex], eachShare);
        }
    }

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

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    function addAddress(address newRecipientAddress) public onlyOwner{
        validRecipientAddresses.push(newRecipientAddress);
    }
}

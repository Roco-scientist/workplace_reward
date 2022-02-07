// SPDX-License-Identifier: AGPL 3.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Swap is Ownable {
    IERC20 RewardsContract;
    IERC20 ThanksContract;
    address[] validRecipientAddresses;

    event Sent(address _from, address _to, uint32 _amount);

    constructor(address _rewardsAddress, address _thanksAddress) public {
        RewardsContract = IERC20(_rewardsAddress);
        ThanksContract = IERC20(_thanksAddress);
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
    function sendThanks(uint32 amount, address toAddress) public {
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
        RewardsContract.transfer(toAddress, amount);

        emit Sent(msg.sender, toAddress, amount);
    }

    // Redeem tokens for awards.  This still needs work
    function redeem(uint32 amount) public {
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
        for (uint32 userIndex; userIndex < validRecipientAddresses.length; userIndex++) {
            ThanksContract.transfer(validRecipientAddresses[userIndex], eachShare);
        }
    }

    // Allow the ability to withdraw tokens that were not supposed to be deposited
    function withdrawToken(address _tokenContract, uint32 _amount) public onlyOwner {
        IERC20 tokenContract = IERC20(_tokenContract);
        
        // transfer the token from address of this contract
        // to address of the user (executing the withdrawToken() function)
        tokenContract.transfer(msg.sender, _amount);
    }

    // Below functions are meant to allow funding of the contract in order to pay for gas etc.
    // Allow any crypto sent to the contract to be removed
    function withdrawEth() public payable onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
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

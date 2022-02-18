// SPDX-License-Identifier: AGPL 3.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "../interfaces/IERC20Custom.sol";

contract Swap is Ownable {
    IERC20Custom public RewardsContract;
    IERC20Custom public ThanksContract;

    event Sent(address indexed _from, address indexed _to, uint256 _amount, uint256 _message);
    event redeemed(address indexed _redeemer, uint256 _amount);

    constructor(address _rewardsAddress, address _thanksAddress) public {
        RewardsContract = IERC20Custom(_rewardsAddress);
        ThanksContract = IERC20Custom(_thanksAddress);
    }

    // Function which takes in a thank you token and send a reward token to the user indicated
    function sendThanks(uint256 amount, address toAddress, uint256 message) public {
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

        emit Sent(msg.sender, toAddress, amount, message);
    }

    // Redeem tokens for awards.  This still needs work
    function redeem(uint256 amount) public {
        // require(addressSetup(msg.sender), "User not yet setup");
        require(RewardsContract.balanceOf(msg.sender) >= amount, "Trying to redeem more rewards than you are holding");

        RewardsContract.transferFrom(msg.sender, address(this), amount);
        emit redeemed(msg.sender, amount);
    }

    // Distribute the thank you tokens contained within the contract.  This equally distributes
    // any tokens to all added users.  
    function distribute(address[] memory recipients, uint256 amount) public onlyOwner {
        // Make sure there are recepients
        require(recipients.length > 0, "No recipient addresses");
        require((recipients.length * amount) <= ThanksContract.balanceOf(address(this)), "Not enough thanks tokens within the contract to fund recipients.  Mint more tokens.");

        // Send the thank you tokens to each address
        for (uint256 userIndex; userIndex < recipients.length; userIndex++) {
            ThanksContract.transfer(recipients[userIndex], amount);
        }
    }

    // Directly send minted thanks tokens to users.  This is more gas efficient
    function mintThanksToUsers(address[] memory recipients, uint256 amount) public onlyOwner {
        RewardsContract.mint(address(this), amount * recipients.length);
        // mint the thank you tokens to each address
        for (uint256 userIndex; userIndex < recipients.length; userIndex++) {
            ThanksContract.mint(recipients[userIndex], amount);
        }
    }

    // Mint tokens to the contract to replenish or increase the rewards/thanks tokens
    function addMintedTokens(uint256 amountThanks, uint256 amountRewards) public onlyOwner {
        RewardsContract.mint(address(this), amountRewards);
        ThanksContract.mint(address(this), amountThanks);
    }

    // Allow the ability to withdraw tokens that were not supposed to be deposited
    function withdrawToken(address _tokenContract, uint256 _amount) public onlyOwner {
        IERC20Custom tokenContract = IERC20Custom(_tokenContract);
        
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

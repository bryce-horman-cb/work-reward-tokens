// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title BugBountyToken
 * @notice Simple ERC-20 token for bug bounty rewards
 * @dev Minimal implementation for hackathon MVP
 */
contract BugBountyToken is ERC20, Ownable {
    
    event TokensMinted(address indexed recipient, uint256 amount);

    constructor() ERC20("Bug Bounty Token", "BBT") Ownable(msg.sender) {
        // Initial supply is 0 - tokens are minted on demand
    }

    /**
     * @notice Mint tokens to a recipient (owner only)
     * @param to Address to receive tokens
     * @param amount Amount of tokens to mint
     */
    function mint(address to, uint256 amount) external onlyOwner {
        require(to != address(0), "Cannot mint to zero address");
        require(amount > 0, "Amount must be greater than 0");
        
        _mint(to, amount);
        emit TokensMinted(to, amount);
    }
}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {BugBountyToken} from "./BugBountyToken.sol";

/**
 * @title BugBountyRewards
 * @notice Manages reward distribution for completed bugs
 * @dev Minimal implementation for hackathon MVP
 */
contract BugBountyRewards is Ownable {
    
    BugBountyToken public immutable token;
    
    // Track user statistics
    mapping(address => uint256) public bugsCompleted;
    mapping(address => uint256) public tokensEarned;
    
    // Track processed bugs to prevent duplicates
    mapping(string => bool) public processedBugs;
    
    // Severity to reward mapping (in wei)
    mapping(uint8 => uint256) public severityRewards;
    
    event BugCompleted(address indexed developer, string bugId, uint8 severity, uint256 reward);
    event SeverityRewardUpdated(uint8 severity, uint256 reward);

    constructor(address _token) Ownable(msg.sender) {
        require(_token != address(0), "Token address cannot be zero");
        token = BugBountyToken(_token);
        
        // Set default rewards (can be updated by owner)
        severityRewards[1] = 100 * 10**18;  // Low: 100 BBT
        severityRewards[2] = 250 * 10**18;  // Medium: 250 BBT
        severityRewards[3] = 500 * 10**18;  // High: 500 BBT
        severityRewards[4] = 1000 * 10**18; // Critical: 1000 BBT
    }

    /**
     * @notice Process a bug completion and mint rewards
     * @param developer Address of the developer who completed the bug
     * @param bugId Unique identifier for the bug (e.g., "PROJ-123")
     * @param severity Bug severity (1=Low, 2=Medium, 3=High, 4=Critical)
     */
    function rewardBugCompletion(
        address developer,
        string calldata bugId,
        uint8 severity
    ) external onlyOwner {
        require(developer != address(0), "Developer address cannot be zero");
        require(bytes(bugId).length > 0, "Bug ID cannot be empty");
        require(severity >= 1 && severity <= 4, "Invalid severity level");
        require(!processedBugs[bugId], "Bug already processed");
        
        uint256 reward = severityRewards[severity];
        require(reward > 0, "No reward set for this severity");
        
        // Mark bug as processed
        processedBugs[bugId] = true;
        
        // Update user stats
        bugsCompleted[developer]++;
        tokensEarned[developer] += reward;
        
        // Mint tokens to developer
        token.mint(developer, reward);
        
        emit BugCompleted(developer, bugId, severity, reward);
    }

    /**
     * @notice Update reward amount for a severity level
     * @param severity Severity level (1-4)
     * @param reward New reward amount in wei
     */
    function setSeverityReward(uint8 severity, uint256 reward) external onlyOwner {
        require(severity >= 1 && severity <= 4, "Invalid severity level");
        severityRewards[severity] = reward;
        emit SeverityRewardUpdated(severity, reward);
    }

    /**
     * @notice Get user statistics
     * @param user Address to query
     * @return bugsCount Number of bugs completed
     * @return tokensCount Total tokens earned
     */
    function getUserStats(address user) external view returns (uint256 bugsCount, uint256 tokensCount) {
        return (bugsCompleted[user], tokensEarned[user]);
    }
}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {WorkToken} from "./WorkToken.sol";

/**
 * @title WorkRewards
 * @notice Generic WORK token distribution system for any platform integration
 * @dev Extensible design for Jira, GitHub, Slack, and future integrations
 */
contract WorkRewards is Ownable {
    WorkToken public immutable token;

    // Track user statistics
    mapping(address => uint256) public totalActivitiesCompleted;
    mapping(address => uint256) public totalTokensEarned;

    // Track processed activities to prevent duplicates (activityId => processed)
    mapping(string => bool) public processedActivities;

    // Track activities by platform for analytics (platform => count)
    mapping(string => uint256) public activitiesByPlatform;

    // Track allowed platforms (platform => allowed)
    mapping(string => bool) public allowedPlatforms;

    event WorkRewarded(address indexed recipient, uint256 amount, string activityId, string platform, string metadata);

    event PlatformAdded(string platform);

    constructor(address _token) Ownable(msg.sender) {
        require(_token != address(0), "Token address cannot be zero");
        token = WorkToken(_token);

        // Initialize default allowed platforms (additional platforms can be added later)
        allowedPlatforms["jira"] = true;
        allowedPlatforms["github"] = true;
        allowedPlatforms["slack"] = true;
        allowedPlatforms["custom"] = true; // For special cases
    }

    /**
     * @notice Award WORK tokens for any completed activity
     * @param recipient Address to receive the tokens
     * @param amount Amount of WORK tokens to mint (in wei)
     * @param activityId Unique identifier to prevent duplicates (e.g., "JIRA-123", "GITHUB-PR-456")
     * @param platform Source platform (e.g., "jira", "github", "slack")
     * @param metadata Optional additional data for tracking/analytics
     */
    function awardTokens(
        address recipient,
        uint256 amount,
        string memory activityId,
        string memory platform,
        string memory metadata
    ) public onlyOwner {
        require(recipient != address(0), "Recipient cannot be zero address");
        require(amount > 0, "Amount must be greater than 0");
        require(bytes(activityId).length > 0, "Activity ID cannot be empty");
        require(bytes(platform).length > 0, "Platform cannot be empty");
        require(allowedPlatforms[platform], "Platform not allowed");
        require(!processedActivities[activityId], "Activity already processed");

        // Mark activity as processed
        processedActivities[activityId] = true;

        // Update statistics
        totalActivitiesCompleted[recipient]++;
        totalTokensEarned[recipient] += amount;
        activitiesByPlatform[platform]++;

        // Mint tokens
        token.mint(recipient, amount);

        emit WorkRewarded(recipient, amount, activityId, platform, metadata);
    }

    /**
     * @notice Batch award tokens to multiple recipients
     * @param recipients Array of addresses to receive tokens
     * @param amounts Array of token amounts (must match recipients length)
     * @param activityIds Array of unique activity IDs
     * @param platform Source platform for all activities
     * @param metadata Metadata for all activities
     */
    function batchAwardTokens(
        address[] calldata recipients,
        uint256[] calldata amounts,
        string[] calldata activityIds,
        string memory platform,
        string memory metadata
    ) external onlyOwner {
        require(recipients.length == amounts.length, "Arrays length mismatch");
        require(recipients.length == activityIds.length, "Arrays length mismatch");
        require(recipients.length > 0, "Empty arrays");

        for (uint256 i = 0; i < recipients.length; i++) {
            awardTokens(recipients[i], amounts[i], activityIds[i], platform, metadata);
        }
    }

    /**
     * @notice Get user statistics
     * @param user Address to query
     * @return activitiesCount Total activities completed
     * @return tokensCount Total tokens earned
     */
    function getUserStats(address user) external view returns (uint256 activitiesCount, uint256 tokensCount) {
        return (totalActivitiesCompleted[user], totalTokensEarned[user]);
    }

    /**
     * @notice Get platform activity statistics
     * @param platform Platform name to query
     * @return count Number of activities processed for this platform
     */
    function getPlatformStats(string memory platform) external view returns (uint256 count) {
        return activitiesByPlatform[platform];
    }

    /**
     * @notice Check if an activity has been processed
     * @param activityId Activity ID to check
     * @return processed Whether the activity has been processed
     */
    function isActivityProcessed(string memory activityId) external view returns (bool processed) {
        return processedActivities[activityId];
    }

    /**
     * @notice Check if a platform is allowed (read-only)
     * @param platform Platform name to check
     * @return allowed Whether the platform is allowed
     */
    function isPlatformAllowed(string memory platform) external view returns (bool allowed) {
        return allowedPlatforms[platform];
    }

    /**
     * @notice Add a new platform to the allowed list
     * @param platform Platform name (e.g., "discord", "notion", "asana")
     */
    function addPlatform(string memory platform) external onlyOwner {
        require(bytes(platform).length > 0, "Platform cannot be empty");
        require(!allowedPlatforms[platform], "Platform already exists");

        allowedPlatforms[platform] = true;
        emit PlatformAdded(platform);
    }
}

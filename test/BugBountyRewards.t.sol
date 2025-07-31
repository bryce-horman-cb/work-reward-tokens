// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Test, console} from "forge-std/Test.sol";
import {BugBountyToken} from "../src/BugBountyToken.sol";
import {BugBountyRewards} from "../src/BugBountyRewards.sol";

contract BugBountyRewardsTest is Test {
    BugBountyToken public token;
    BugBountyRewards public rewards;
    address public owner;
    address public developer;

    function setUp() public {
        owner = address(this);
        developer = makeAddr("developer");
        
        // Deploy contracts
        token = new BugBountyToken();
        rewards = new BugBountyRewards(address(token));
        
        // Transfer token ownership to rewards contract so it can mint
        token.transferOwnership(address(rewards));
    }

    function test_InitialState() public {
        assertEq(address(rewards.token()), address(token));
        assertEq(rewards.owner(), owner);
        
        // Check default severity rewards
        assertEq(rewards.severityRewards(1), 100 * 10**18);  // Low
        assertEq(rewards.severityRewards(2), 250 * 10**18);  // Medium
        assertEq(rewards.severityRewards(3), 500 * 10**18);  // High
        assertEq(rewards.severityRewards(4), 1000 * 10**18); // Critical
    }

    function test_RewardBugCompletion() public {
        string memory bugId = "PROJ-123";
        uint8 severity = 3; // High
        uint256 expectedReward = 500 * 10**18;
        
        rewards.rewardBugCompletion(developer, bugId, severity);
        
        // Check token balance
        assertEq(token.balanceOf(developer), expectedReward);
        
        // Check user stats
        (uint256 bugsCount, uint256 tokensCount) = rewards.getUserStats(developer);
        assertEq(bugsCount, 1);
        assertEq(tokensCount, expectedReward);
        
        // Check bug is marked as processed
        assertTrue(rewards.processedBugs(bugId));
    }

    function test_RewardBugCompletionEmitsEvent() public {
        string memory bugId = "PROJ-456";
        uint8 severity = 4; // Critical
        uint256 expectedReward = 1000 * 10**18;
        
        vm.expectEmit(true, false, false, true);
        emit BugBountyRewards.BugCompleted(developer, bugId, severity, expectedReward);
        
        rewards.rewardBugCompletion(developer, bugId, severity);
    }

    function test_RevertDuplicateBugProcessing() public {
        string memory bugId = "PROJ-789";
        
        // First completion should work
        rewards.rewardBugCompletion(developer, bugId, 2);
        
        // Second completion should revert
        vm.expectRevert("Bug already processed");
        rewards.rewardBugCompletion(developer, bugId, 2);
    }

    function test_RevertInvalidSeverity() public {
        vm.expectRevert("Invalid severity level");
        rewards.rewardBugCompletion(developer, "PROJ-000", 0);
        
        vm.expectRevert("Invalid severity level");
        rewards.rewardBugCompletion(developer, "PROJ-001", 5);
    }

    function test_SetSeverityReward() public {
        uint8 severity = 2;
        uint256 newReward = 300 * 10**18;
        
        vm.expectEmit(false, false, false, true);
        emit BugBountyRewards.SeverityRewardUpdated(severity, newReward);
        
        rewards.setSeverityReward(severity, newReward);
        assertEq(rewards.severityRewards(severity), newReward);
    }

    function test_MultipleCompletions() public {
        // Complete multiple bugs with different severities
        rewards.rewardBugCompletion(developer, "PROJ-100", 1); // 100 BBT
        rewards.rewardBugCompletion(developer, "PROJ-200", 4); // 1000 BBT
        rewards.rewardBugCompletion(developer, "PROJ-300", 2); // 250 BBT
        
        uint256 expectedTotal = 100 * 10**18 + 1000 * 10**18 + 250 * 10**18;
        
        assertEq(token.balanceOf(developer), expectedTotal);
        
        (uint256 bugsCount, uint256 tokensCount) = rewards.getUserStats(developer);
        assertEq(bugsCount, 3);
        assertEq(tokensCount, expectedTotal);
    }
}
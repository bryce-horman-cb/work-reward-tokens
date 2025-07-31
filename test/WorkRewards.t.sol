// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Test, console} from "forge-std/Test.sol";
import {WorkToken} from "../src/WorkToken.sol";
import {WorkRewards} from "../src/WorkRewards.sol";

contract WorkRewardsTest is Test {
    WorkToken public token;
    WorkRewards public rewards;
    address public owner;
    address public worker1;
    address public worker2;

    function setUp() public {
        owner = address(this);
        worker1 = makeAddr("worker1");
        worker2 = makeAddr("worker2");

        // Deploy contracts
        token = new WorkToken();
        rewards = new WorkRewards(address(token));

        // Transfer token ownership to rewards contract so it can mint
        token.transferOwnership(address(rewards));
    }

    function test_InitialState() public {
        assertEq(address(rewards.token()), address(token));
        assertEq(rewards.owner(), owner);

        // Check initial stats are zero
        (uint256 activities, uint256 tokens) = rewards.getUserStats(worker1);
        assertEq(activities, 0);
        assertEq(tokens, 0);

        assertEq(rewards.getPlatformStats("jira"), 0);
        assertEq(rewards.getPlatformStats("github"), 0);
    }

    function test_AwardTokens() public {
        uint256 amount = 500 * 10 ** 18;
        string memory activityId = "JIRA-123";
        string memory platform = "jira";
        string memory metadata = "bug-fix-high-priority";

        rewards.awardTokens(worker1, amount, activityId, platform, metadata);

        // Check token balance
        assertEq(token.balanceOf(worker1), amount);

        // Check user stats
        (uint256 activities, uint256 tokens) = rewards.getUserStats(worker1);
        assertEq(activities, 1);
        assertEq(tokens, amount);

        // Check platform stats
        assertEq(rewards.getPlatformStats(platform), 1);

        // Check activity is marked as processed
        assertTrue(rewards.isActivityProcessed(activityId));
    }

    function test_AwardTokensEmitsEvent() public {
        uint256 amount = 750 * 10 ** 18;
        string memory activityId = "GITHUB-PR-456";
        string memory platform = "github";
        string memory metadata = "pull-request-merged";

        vm.expectEmit(true, false, false, true);
        emit WorkRewards.WorkRewarded(worker1, amount, activityId, platform, metadata);

        rewards.awardTokens(worker1, amount, activityId, platform, metadata);
    }

    function test_MultiPlatformActivities() public {
        // Jira activity
        rewards.awardTokens(worker1, 100 * 10 ** 18, "JIRA-001", "jira", "bug-fix");

        // GitHub activity
        rewards.awardTokens(worker1, 200 * 10 ** 18, "GITHUB-PR-001", "github", "feature");

        // Slack activity
        rewards.awardTokens(worker1, 50 * 10 ** 18, "SLACK-HELP-001", "slack", "help-colleague");

        // Check totals
        assertEq(token.balanceOf(worker1), 350 * 10 ** 18);

        (uint256 activities, uint256 tokens) = rewards.getUserStats(worker1);
        assertEq(activities, 3);
        assertEq(tokens, 350 * 10 ** 18);

        // Check platform stats
        assertEq(rewards.getPlatformStats("jira"), 1);
        assertEq(rewards.getPlatformStats("github"), 1);
        assertEq(rewards.getPlatformStats("slack"), 1);
    }

    function test_BatchAwardTokens() public {
        address[] memory recipients = new address[](3);
        uint256[] memory amounts = new uint256[](3);
        string[] memory activityIds = new string[](3);

        recipients[0] = worker1;
        recipients[1] = worker2;
        recipients[2] = worker1; // worker1 gets two rewards

        amounts[0] = 100 * 10 ** 18;
        amounts[1] = 200 * 10 ** 18;
        amounts[2] = 150 * 10 ** 18;

        activityIds[0] = "BATCH-001";
        activityIds[1] = "BATCH-002";
        activityIds[2] = "BATCH-003";

        rewards.batchAwardTokens(recipients, amounts, activityIds, "github", "batch-pr-review");

        // Check balances
        assertEq(token.balanceOf(worker1), 250 * 10 ** 18); // 100 + 150
        assertEq(token.balanceOf(worker2), 200 * 10 ** 18);

        // Check platform stats
        assertEq(rewards.getPlatformStats("github"), 3);
    }

    function test_RevertDuplicateActivity() public {
        string memory activityId = "DUPLICATE-TEST";

        // First award should work
        rewards.awardTokens(worker1, 100 * 10 ** 18, activityId, "jira", "test");

        // Second award with same ID should revert
        vm.expectRevert("Activity already processed");
        rewards.awardTokens(worker2, 200 * 10 ** 18, activityId, "jira", "test");
    }

    function test_RevertInvalidInputs() public {
        // Zero address
        vm.expectRevert("Recipient cannot be zero address");
        rewards.awardTokens(address(0), 100, "TEST-001", "jira", "test");

        // Zero amount
        vm.expectRevert("Amount must be greater than 0");
        rewards.awardTokens(worker1, 0, "TEST-002", "jira", "test");

        // Empty activity ID
        vm.expectRevert("Activity ID cannot be empty");
        rewards.awardTokens(worker1, 100, "", "jira", "test");

        // Empty platform
        vm.expectRevert("Platform cannot be empty");
        rewards.awardTokens(worker1, 100, "TEST-003", "", "test");
    }

    function test_FlexibleAmounts() public {
        // Award custom amounts for different activities
        rewards.awardTokens(worker1, 1 * 10 ** 18, "SMALL-TASK", "slack", "quick-help");
        rewards.awardTokens(worker1, 5000 * 10 ** 18, "MAJOR-PROJECT", "github", "epic-feature");
        rewards.awardTokens(worker1, 42 * 10 ** 18, "CUSTOM-AMOUNT", "jira", "special-case");

        uint256 expectedTotal = (1 + 5000 + 42) * 10 ** 18;
        assertEq(token.balanceOf(worker1), expectedTotal);

        (uint256 activities, uint256 tokens) = rewards.getUserStats(worker1);
        assertEq(activities, 3);
        assertEq(tokens, expectedTotal);
    }

    function test_PlatformManagement() public {
        // Check default platforms are allowed
        assertTrue(rewards.isPlatformAllowed("jira"));
        assertTrue(rewards.isPlatformAllowed("github"));
        assertTrue(rewards.isPlatformAllowed("slack"));
        assertTrue(rewards.isPlatformAllowed("custom"));

        // Check unknown platform is not allowed
        assertFalse(rewards.isPlatformAllowed("discord"));

        // Add new platform
        vm.expectEmit(false, false, false, true);
        emit WorkRewards.PlatformAdded("discord");

        rewards.addPlatform("discord");

        // Check new platform is now allowed
        assertTrue(rewards.isPlatformAllowed("discord"));

        // Use new platform
        rewards.awardTokens(worker1, 100 * 10 ** 18, "DISCORD-001", "discord", "community-help");
        assertEq(token.balanceOf(worker1), 100 * 10 ** 18);
        assertEq(rewards.getPlatformStats("discord"), 1);
    }

    function test_RevertUnknownPlatform() public {
        // Try to use unknown platform
        vm.expectRevert("Platform not allowed");
        rewards.awardTokens(worker1, 100 * 10 ** 18, "TEST-001", "unknown-platform", "test");
    }

    function test_RevertAddExistingPlatform() public {
        // Try to add platform that already exists
        vm.expectRevert("Platform already exists");
        rewards.addPlatform("jira");
    }

    function test_RevertAddEmptyPlatform() public {
        vm.expectRevert("Platform cannot be empty");
        rewards.addPlatform("");
    }
}

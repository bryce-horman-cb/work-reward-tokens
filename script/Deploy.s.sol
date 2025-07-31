// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script, console} from "forge-std/Script.sol";
import {WorkToken} from "../src/WorkToken.sol";
import {WorkRewards} from "../src/WorkRewards.sol";

contract DeployScript is Script {
    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy token first
        console.log("Deploying WorkToken (WORK Coin)...");
        WorkToken token = new WorkToken();
        console.log("WorkToken deployed at:", address(token));
        
        // Deploy rewards contract
        console.log("Deploying WorkRewards...");
        WorkRewards rewards = new WorkRewards(address(token));
        console.log("WorkRewards deployed at:", address(rewards));
        
        // Transfer token ownership to rewards contract
        console.log("Transferring token ownership to rewards contract...");
        token.transferOwnership(address(rewards));
        console.log("Token ownership transferred");
        
        // Log final configuration
        console.log("\n=== WORK COIN DEPLOYMENT COMPLETE ===");
        console.log("Token Address:", address(token));
        console.log("Rewards Address:", address(rewards));
        console.log("Token Name:", token.name());
        console.log("Token Symbol:", token.symbol());
        console.log("Token Owner:", token.owner());
        console.log("Rewards Owner:", rewards.owner());
        
        // Log available functions
        console.log("\n=== AVAILABLE FEATURES ===");
        console.log("- awardTokens(): Flexible token distribution");
        console.log("- batchAwardTokens(): Bulk token distribution");
        console.log("- Platform tracking: jira, github, slack, etc.");
        console.log("- Legacy functions: rewardTaskCompletion, rewardBugCompletion");
        
        vm.stopBroadcast();
    }
}
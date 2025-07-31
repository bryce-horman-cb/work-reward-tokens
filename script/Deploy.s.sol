// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script, console} from "forge-std/Script.sol";
import {BugBountyToken} from "../src/BugBountyToken.sol";
import {BugBountyRewards} from "../src/BugBountyRewards.sol";

contract DeployScript is Script {
    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy token first
        console.log("Deploying BugBountyToken...");
        BugBountyToken token = new BugBountyToken();
        console.log("BugBountyToken deployed at:", address(token));
        
        // Deploy rewards contract
        console.log("Deploying BugBountyRewards...");
        BugBountyRewards rewards = new BugBountyRewards(address(token));
        console.log("BugBountyRewards deployed at:", address(rewards));
        
        // Transfer token ownership to rewards contract
        console.log("Transferring token ownership to rewards contract...");
        token.transferOwnership(address(rewards));
        console.log("Token ownership transferred");
        
        // Log final configuration
        console.log("\n=== DEPLOYMENT COMPLETE ===");
        console.log("Token Address:", address(token));
        console.log("Rewards Address:", address(rewards));
        console.log("Token Owner:", token.owner());
        console.log("Rewards Owner:", rewards.owner());
        
        vm.stopBroadcast();
    }
}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Test, console} from "forge-std/Test.sol";
import {BugBountyToken} from "../src/BugBountyToken.sol";

contract BugBountyTokenTest is Test {
    BugBountyToken public token;
    address public owner;
    address public user;

    function setUp() public {
        owner = address(this);
        user = makeAddr("user");
        token = new BugBountyToken();
    }

    function test_InitialState() public {
        assertEq(token.name(), "Bug Bounty Token");
        assertEq(token.symbol(), "BBT");
        assertEq(token.decimals(), 18);
        assertEq(token.totalSupply(), 0);
        assertEq(token.owner(), owner);
    }

    function test_Mint() public {
        uint256 amount = 1000 * 10**18; // 1000 BBT
        
        token.mint(user, amount);
        
        assertEq(token.balanceOf(user), amount);
        assertEq(token.totalSupply(), amount);
    }

    function test_MintEmitsEvent() public {
        uint256 amount = 500 * 10**18;
        
        vm.expectEmit(true, false, false, true);
        emit BugBountyToken.TokensMinted(user, amount);
        
        token.mint(user, amount);
    }

    function test_RevertMintToZeroAddress() public {
        vm.expectRevert("Cannot mint to zero address");
        token.mint(address(0), 100);
    }

    function test_RevertMintZeroAmount() public {
        vm.expectRevert("Amount must be greater than 0");
        token.mint(user, 0);
    }

    function test_RevertMintNotOwner() public {
        vm.prank(user);
        vm.expectRevert();
        token.mint(user, 100);
    }
}
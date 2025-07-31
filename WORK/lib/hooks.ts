/**
 * Custom hooks for WORK token integration
 */

import { useReadContract, useAccount } from "wagmi";
import { formatUnits } from "viem";
import { CONTRACTS, WORK_TOKEN_ABI, WORK_REWARDS_ABI } from "./contracts";

/**
 * Hook to get WORK token balance for connected wallet
 */
export function useWorkTokenBalance() {
  const { address, isConnected } = useAccount();

  const {
    data: balance,
    isLoading,
    error,
    refetch,
  } = useReadContract({
    address: CONTRACTS.WORK_TOKEN,
    abi: WORK_TOKEN_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: isConnected && !!address,
      refetchInterval: 10000, // Refetch every 10 seconds
    },
  });

  // Format balance from wei to human-readable format
  const formattedBalance = balance ? formatUnits(balance, 18) : "0";
  const balanceAsNumber = balance ? Number(formatUnits(balance, 18)) : 0;

  return {
    balance: formattedBalance,
    balanceAsNumber,
    rawBalance: balance,
    isLoading,
    error,
    refetch,
    isConnected,
  };
}

/**
 * Hook to get user stats from WorkRewards contract
 */
export function useUserStats() {
  const { address, isConnected } = useAccount();

  const {
    data: stats,
    isLoading,
    error,
  } = useReadContract({
    address: CONTRACTS.WORK_REWARDS,
    abi: WORK_REWARDS_ABI,
    functionName: "getUserStats",
    args: address ? [address] : undefined,
    query: {
      enabled: isConnected && !!address,
      refetchInterval: 15000, // Refetch every 15 seconds
    },
  });

  const totalActivities = stats?.[0] ? Number(stats[0]) : 0;
  const totalTokensEarned = stats?.[1] ? Number(formatUnits(stats[1], 18)) : 0;

  return {
    totalActivities,
    totalTokensEarned,
    isLoading,
    error,
    isConnected,
  };
}

/**
 * Hook to get WORK token metadata
 */
export function useWorkTokenInfo() {
  const { data: name } = useReadContract({
    address: CONTRACTS.WORK_TOKEN,
    abi: WORK_TOKEN_ABI,
    functionName: "name",
  });

  const { data: symbol } = useReadContract({
    address: CONTRACTS.WORK_TOKEN,
    abi: WORK_TOKEN_ABI,
    functionName: "symbol",
  });

  const { data: totalSupply } = useReadContract({
    address: CONTRACTS.WORK_TOKEN,
    abi: WORK_TOKEN_ABI,
    functionName: "totalSupply",
  });

  const formattedSupply = totalSupply ? formatUnits(totalSupply, 18) : "0";

  return {
    name: name as string,
    symbol: symbol as string,
    totalSupply: formattedSupply,
    rawTotalSupply: totalSupply,
  };
}

/**
 * Hook to get leaderboard data from WorkRewards contract
 */
export function useLeaderboard() {
  const { isConnected } = useAccount();

  const {
    data: leaderboardData,
    isLoading,
    error,
    refetch,
  } = useReadContract({
    address: CONTRACTS.WORK_REWARDS,
    abi: WORK_REWARDS_ABI,
    functionName: "getLeaderboard",
    query: {
      enabled: isConnected,
      refetchInterval: 30000, // Refetch every 30 seconds
    },
  });

  // Process the data into a more usable format
  interface LeaderboardUser {
    address: string;
    activities: number;
    tokens: number;
    rawTokens: bigint;
    rank: number;
  }

  const leaderboard: LeaderboardUser[] = leaderboardData
    ? leaderboardData[0]
        .map((address: string, index: number) => ({
          address,
          activities: Number(leaderboardData[1][index]),
          tokens: Number(formatUnits(leaderboardData[2][index], 18)),
          rawTokens: leaderboardData[2][index],
        }))
        .sort(
          (a: { tokens: number }, b: { tokens: number }) => b.tokens - a.tokens
        ) // Sort by tokens (descending)
        .map(
          (
            user: {
              address: string;
              activities: number;
              tokens: number;
              rawTokens: bigint;
            },
            index: number
          ) => ({
            ...user,
            rank: index + 1,
          })
        )
    : [];

  return {
    leaderboard,
    isLoading,
    error,
    refetch,
    totalUsers: leaderboard.length,
  };
}

/**
 * Hook to get total number of users
 */
export function useTotalUsers() {
  const { isConnected } = useAccount();

  const {
    data: totalUsers,
    isLoading,
    error,
  } = useReadContract({
    address: CONTRACTS.WORK_REWARDS,
    abi: WORK_REWARDS_ABI,
    functionName: "getTotalUsers",
    query: {
      enabled: isConnected,
      refetchInterval: 60000, // Refetch every minute
    },
  });

  return {
    totalUsers: totalUsers ? Number(totalUsers) : 0,
    isLoading,
    error,
  };
}

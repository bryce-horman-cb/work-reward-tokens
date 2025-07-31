'use client';

import { useState } from 'react';
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownLink,
  WalletDropdownDisconnect,
} from '@coinbase/onchainkit/wallet';
import {
  Address,
  Avatar,
  Name,
  Identity,
  EthBalance,
} from '@coinbase/onchainkit/identity';

export default function App() {
  // Simplified - only wallet connection needed
  const [activeTab, setActiveTab] = useState<'stats' | 'leaderboard'>('stats');

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6 max-w-6xl mx-auto">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-[#1652F0] rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">W</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-semibold text-gray-900 dark:text-white">
              WORK
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 -mt-1">
              Workplace Operations & Response Kudos
            </span>
          </div>
        </div>
        
          <div className="wallet-container">
            <Wallet>
            <ConnectWallet className="bg-[#1652F0] hover:bg-[#0043CE] text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-sm">
              <Avatar className="h-5 w-5" />
                <Name />
              </ConnectWallet>
              <WalletDropdown>
                <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                  <Avatar />
                  <Name />
                  <Address />
                  <EthBalance />
                </Identity>
                <WalletDropdownLink
                  icon="wallet"
                  href="https://keys.coinbase.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Wallet
                </WalletDropdownLink>
                <WalletDropdownDisconnect />
              </WalletDropdown>
            </Wallet>
          </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-gray-900 dark:text-white">
            Get rewarded for <span className="text-[#1652F0]">productive work</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            Complete Jira tickets and Slack tasks to earn crypto tokens. Transform your workplace productivity into digital rewards with WORK.
          </p>

          {/* Sign In Section */}
          <div className="max-w-lg mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-[#1652F0] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 17.568l-5.568 5.568-5.568-5.568L6.432 12l5.568-5.568L17.568 12l-5.568 5.568z"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">
                  Welcome to WORK
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Connect your Coinbase Wallet to start earning
                </p>
              </div>
              
              <div className="w-full flex justify-center">
                <Wallet>
                  <ConnectWallet className="w-full bg-[#1652F0] hover:bg-[#0043CE] text-white py-4 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-3">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span>Connect Coinbase Wallet</span>
                  </ConnectWallet>
                  <WalletDropdown>
                    <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                      <Avatar />
                      <Name />
                      <Address />
                      <EthBalance />
                    </Identity>
                    <WalletDropdownLink
                      icon="wallet"
                      href="https://keys.coinbase.com"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                      Wallet
                    </WalletDropdownLink>
                    <WalletDropdownDisconnect />
                  </WalletDropdown>
                </Wallet>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600 text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Your wallet is secured by Coinbase's institutional-grade custody
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-20">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8 justify-center">
              <button
                onClick={() => setActiveTab('stats')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                  activeTab === 'stats'
                    ? 'border-[#1652F0] text-[#1652F0]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                My Stats
              </button>
              <button
                onClick={() => setActiveTab('leaderboard')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                  activeTab === 'leaderboard'
                    ? 'border-[#1652F0] text-[#1652F0]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Leaderboard
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="mt-8">
            {activeTab === 'stats' && (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Stats Cards */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-[#F6F8FF] rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-[#1652F0]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" fill="none"/>
                      </svg>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">24</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Jira Tickets Completed</div>
                  <div className="text-xs text-green-600 dark:text-green-400 mt-2">+3 this week</div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-[#F6F8FF] rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-[#1652F0]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke="currentColor" strokeWidth="2" fill="none"/>
                      </svg>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">156</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Slack Messages</div>
                  <div className="text-xs text-green-600 dark:text-green-400 mt-2">+12 today</div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-[#F6F8FF] rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-[#1652F0]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" fill="none"/>
                      </svg>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">1,250</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">WORK Tokens Earned</div>
                  <div className="text-xs text-green-600 dark:text-green-400 mt-2">+50 this week</div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-[#F6F8FF] rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-[#1652F0]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="currentColor" strokeWidth="2" fill="none"/>
                      </svg>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">7</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Current Streak</div>
                  <div className="text-xs text-orange-600 dark:text-orange-400 mt-2">days active</div>
                </div>

                {/* Larger Stats Cards */}
                <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">Completed PROJ-123</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Fix authentication bug • 2 hours ago</div>
                      </div>
                      <div className="text-xs text-[#1652F0] font-medium">+25 WORK</div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">Helped teammate</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Answered question in #dev-help • 5 hours ago</div>
                      </div>
                      <div className="text-xs text-[#1652F0] font-medium">+5 WORK</div>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Weekly Progress</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600 dark:text-gray-400">Jira Tickets</span>
                        <span className="text-gray-900 dark:text-white font-medium">3/5 goal</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-[#1652F0] h-2 rounded-full" style={{width: '60%'}}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600 dark:text-gray-400">Slack Engagement</span>
                        <span className="text-gray-900 dark:text-white font-medium">12/10 goal</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{width: '100%'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'leaderboard' && (
              <div className="space-y-6">
                {/* Leaderboard Header */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Team Leaderboard</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Top performers this month</p>
                </div>

                {/* Leaderboard List */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {/* Top 3 with special styling */}
                    <div className="p-6 bg-gradient-to-r from-[#F6F8FF] to-white dark:from-gray-800 dark:to-gray-800">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          1
                        </div>
                        <Avatar className="h-10 w-10" />
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900 dark:text-white">Sarah Chen</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Frontend Developer</div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-[#1652F0]">2,450 WORK</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">42 tickets • 89 messages</div>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          2
                        </div>
                        <Avatar className="h-10 w-10" />
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900 dark:text-white">Mike Rodriguez</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Backend Developer</div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-[#1652F0]">2,180 WORK</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">38 tickets • 72 messages</div>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-orange-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          3
                        </div>
                        <Avatar className="h-10 w-10" />
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900 dark:text-white">Alex Kim</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Product Designer</div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-[#1652F0]">1,920 WORK</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">28 tickets • 94 messages</div>
                        </div>
                      </div>
                    </div>

                    {/* Rest of the leaderboard */}
                    {[
                      { rank: 4, name: 'Emma Watson', role: 'QA Engineer', tokens: 1650, tickets: 24, messages: 61 },
                      { rank: 5, name: 'You', role: 'Developer', tokens: 1250, tickets: 24, messages: 156, isUser: true },
                      { rank: 6, name: 'James Park', role: 'DevOps Engineer', tokens: 980, tickets: 18, messages: 43 },
                      { rank: 7, name: 'Lisa Zhang', role: 'Data Analyst', tokens: 850, tickets: 15, messages: 38 }
                    ].map((user) => (
                      <div key={user.rank} className={`p-6 ${user.isUser ? 'bg-[#F6F8FF] dark:bg-blue-900/20' : ''}`}>
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center text-gray-700 dark:text-gray-300 font-bold">
                            {user.rank}
                          </div>
                          <Avatar className="h-10 w-10" />
                          <div className="flex-1">
                            <div className={`font-semibold ${user.isUser ? 'text-[#1652F0]' : 'text-gray-900 dark:text-white'}`}>
                              {user.name}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">{user.role}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-[#1652F0]">{user.tokens.toLocaleString()} WORK</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{user.tickets} tickets • {user.messages} messages</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Leaderboard Stats */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
                    <div className="text-2xl font-bold text-[#1652F0] mb-2">5th</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Your Rank</div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
                    <div className="text-2xl font-bold text-green-600 mb-2">↑ 2</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Positions This Week</div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
                    <div className="text-2xl font-bold text-orange-600 mb-2">1,200</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Points Behind Leader</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="w-16 h-16 bg-[#1652F0] rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" fill="none"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Complete Jira Tickets</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              Earn tokens by completing development tasks, bug fixes, and feature requests tracked in your team's Jira workspace.
            </p>
          </div>

          <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="w-16 h-16 bg-[#1652F0] rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke="currentColor" strokeWidth="2" fill="none"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Engage on Slack</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              Get rewarded for meaningful Slack contributions, helping teammates, and participating in team discussions.
            </p>
          </div>

          <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="w-16 h-16 bg-[#1652F0] rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" fill="none"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Earn Crypto Rewards</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              Automatically receive tokens in your Coinbase wallet for every completed task and productive workplace contribution.
            </p>
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="mt-16 text-center">
          <div className="bg-[#F6F8FF] dark:bg-gray-800 rounded-2xl p-8 border border-[#E0E7FF] dark:border-gray-700">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              How it works
            </h4>
            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-[#1652F0] text-white rounded-full flex items-center justify-center mb-2 text-xs font-semibold">1</div>
                <p className="text-gray-600 dark:text-gray-300">Connect your Jira and Slack accounts</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-[#1652F0] text-white rounded-full flex items-center justify-center mb-2 text-xs font-semibold">2</div>
                <p className="text-gray-600 dark:text-gray-300">Complete tasks and engage with your team</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-[#1652F0] text-white rounded-full flex items-center justify-center mb-2 text-xs font-semibold">3</div>
                <p className="text-gray-600 dark:text-gray-300">Receive tokens automatically in your wallet</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

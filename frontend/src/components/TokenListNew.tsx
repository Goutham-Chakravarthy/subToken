'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract, usePublicClient } from 'wagmi';
import { SubscriptionToken__factory } from '@/contracts/typechain-types';
import { SUBSCRIPTION_TOKEN_ADDRESS } from '../config';

type Token = {
  id: string;
  serviceId: string;
  timeUnit: number;
  expiryDate: number;
  totalSupply: string;
  balance: string;
};

export default function TokenList() {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Get token contract ABI
  const tokenAbi = SubscriptionToken__factory.abi;

  // Get token balance for the connected wallet
  const { data: balance } = useReadContract({
    address: SUBSCRIPTION_TOKEN_ADDRESS,
    abi: tokenAbi,
    functionName: 'balanceOf',
    args: [address || '0x'],
    query: {
      enabled: !!address,
    },
  });

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        if (!address || !balance || !publicClient) return;

        const tokenCount = Number(balance);
        const tokenPromises: Promise<Token>[] = [];

        for (let i = 0; i < tokenCount; i++) {
          const tokenId = await publicClient.readContract({
            address: SUBSCRIPTION_TOKEN_ADDRESS,
            abi: tokenAbi,
            functionName: 'tokenOfOwnerByIndex',
            args: [address, BigInt(i)],
          });

          const tokenURI = await publicClient.readContract({
            address: SUBSCRIPTION_TOKEN_ADDRESS,
            abi: tokenAbi,
            functionName: 'tokenURI',
            args: [tokenId],
          });

          // Parse token URI (assuming it's a base64 encoded JSON)
          const tokenData = JSON.parse(atob(tokenURI.split(',')[1]));
          
          // Get token balance
          const tokenBalance = await publicClient.readContract({
            address: SUBSCRIPTION_TOKEN_ADDRESS,
            abi: tokenAbi,
            functionName: 'balanceOf',
            args: [address, tokenId],
          });

          tokenPromises.push(Promise.resolve({
            id: tokenId.toString(),
            serviceId: tokenData.serviceId || '',
            timeUnit: tokenData.timeUnit || 0,
            expiryDate: tokenData.expiryDate || 0,
            totalSupply: tokenData.totalSupply || '0',
            balance: tokenBalance?.toString() || '0',
          }));
        }

        const fetchedTokens = await Promise.all(tokenPromises);
        setTokens(fetchedTokens);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching tokens:', err);
        setError('Failed to load tokens');
        setLoading(false);
      }
    };

    fetchTokens();
  }, [address, balance, publicClient, tokenAbi]);

  if (loading) {
    return <div>Loading tokens...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (tokens.length === 0) {
    return <div>No tokens found</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Your Tokens</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tokens.map((token) => (
          <div key={token.id} className="p-4 border rounded-lg">
            <h4 className="font-medium">Token ID: {token.id}</h4>
            <p>Service: {token.serviceId}</p>
            <p>Balance: {token.balance}</p>
            <p>Total Supply: {token.totalSupply}</p>
            <p>Expires: {new Date(token.expiryDate * 1000).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

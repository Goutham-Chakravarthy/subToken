'use client';

import { useState, useEffect } from 'react';
import { useAccount, usePublicClient } from 'wagmi';
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

  // Note: ERC1155 balanceOf requires (account, id). We'll query per tokenId below.

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        if (!address || !publicClient) return;

        const candidates: bigint[] = [];
        const maxToCheck = 100; // reasonable upper bound for now
        for (let id = 1; id <= maxToCheck; id++) {
          // Read tokenInfo to see if token exists (creator != 0x0)
          try {
            const info = await publicClient.readContract({
              address: SUBSCRIPTION_TOKEN_ADDRESS,
              abi: tokenAbi,
              functionName: 'tokenInfo',
              args: [BigInt(id)],
            }) as readonly [
              `0x${string}`, // creator
              string,        // serviceId
              bigint,        // timeUnit
              bigint,        // expiryTime
              boolean,       // isActive
              bigint,        // maxSupply
              bigint,        // currentSupply
              bigint         // price
            ];

            const creator = info[0];
            if (creator && creator !== '0x0000000000000000000000000000000000000000') {
              candidates.push(BigInt(id));
            }
          } catch {
            // stop early if tokenInfo revert suggests id is out of range
            break;
          }
        }

        const tokenPromises: Promise<Token | null>[] = candidates.map(async (tokenId) => {
          const info = await publicClient.readContract({
            address: SUBSCRIPTION_TOKEN_ADDRESS,
            abi: tokenAbi,
            functionName: 'tokenInfo',
            args: [tokenId],
          }) as readonly [
            `0x${string}`,
            string,
            bigint,
            bigint,
            boolean,
            bigint,
            bigint,
            bigint
          ];

          const balanceOfToken = await publicClient.readContract({
            address: SUBSCRIPTION_TOKEN_ADDRESS,
            abi: tokenAbi,
            functionName: 'balanceOf',
            args: [address as `0x${string}`, tokenId],
          }) as bigint;

          if (balanceOfToken === BigInt(0)) return null;

          const [, serviceId, timeUnit, expiryTime, , , currentSupply] = info;

          return {
            id: tokenId.toString(),
            serviceId,
            timeUnit: Number(timeUnit),
            expiryDate: Number(expiryTime),
            totalSupply: currentSupply.toString(),
            balance: balanceOfToken.toString(),
          };
        });

        const fetched = (await Promise.all(tokenPromises)).filter(Boolean) as Token[];
        const fetchedTokens = fetched;
        setTokens(fetchedTokens);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching tokens:', err);
        setError('Failed to load tokens');
        setLoading(false);
      }
    };

    fetchTokens();
  }, [address, publicClient, tokenAbi]);

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

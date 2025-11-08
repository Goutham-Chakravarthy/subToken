'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract, usePublicClient } from 'wagmi';
import { SubscriptionToken__factory } from '../contracts/typechain-types';
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

        // Fetch token details for each token owned by the user
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
                const tokenData = JSON.parse(atob(tokenURI.split(',')[1]));
                
                const tokenBalance = await tokenContract.methods.balanceOf(address, tokenId).call();
                
                resolve({
                  id: tokenId.toString(),
                  serviceId: tokenData.serviceId,
                  timeUnit: tokenData.timeUnit,
                  expiryDate: tokenData.expiryDate,
                  totalSupply: tokenData.totalSupply,
                  balance: ethers.utils.formatUnits(tokenBalance, 18),
                });
              } catch (err) {
                console.error(`Error fetching token ${i}:`, err);
                resolve(null);
              }
            })
          );
        }

        const tokenResults = await Promise.all(tokenPromises);
        setTokens(tokenResults.filter(Boolean));
        setLoading(false);
      } catch (err) {
        console.error('Error fetching tokens:', err);
        setError('Failed to load tokens');
        setLoading(false);
      }
    };

    fetchTokens();
  }, [address, balance]);

  if (loading) {
    return <div className="text-center py-4">Loading your tokens...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>;
  }

  if (tokens.length === 0) {
    return <div className="text-center py-4 text-gray-500">No tokens found</div>;
  }

  return (
    <div className="space-y-4">
      {tokens.map((token) => (
        <div key={token.id} className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <h3 className="font-medium text-lg">Token #{token.id}</h3>
          <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
            <div>Service ID: {token.serviceId}</div>
            <div>Time Unit: {token.timeUnit} seconds</div>
            <div>Expiry: {new Date(token.expiryDate * 1000).toLocaleDateString()}</div>
            <div>Your Balance: {token.balance}</div>
            <div>Total Supply: {token.totalSupply}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

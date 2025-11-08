'use client';

'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, usePublicClient } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { LendingEscrow__factory, SubscriptionToken__factory } from '@/contracts/typechain-types';
import { LENDING_ESCROW_ADDRESS, SUBSCRIPTION_TOKEN_ADDRESS } from '../config';

declare global {
  interface Window {
    ethereum?: any;
  }
}

type Listing = {
  id: string;
  tokenId: string;
  lender: string;
  amount: string;
  rate: string;
  available: string;
  isActive: boolean;
};

export default function LendingDashboard() {
  const { address } = useAccount();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedToken, setSelectedToken] = useState('');
  const [amount, setAmount] = useState('');
  const [rate, setRate] = useState('');

  // Contract ABIs
  const lendingEscrowAbi = LendingEscrow__factory.abi;
  const tokenAbi = SubscriptionToken__factory.abi;

  // Get all listings
  const { data: listingCount } = useReadContract({
    address: LENDING_ESCROW_ADDRESS,
    abi: LendingEscrow__factory.abi,
    functionName: 'listingCounter',
  });

  // Create listing function
  const { writeContract: createListing, isPending: isCreating, data: createTxHash } = useWriteContract({
    mutation: {
      onSuccess: () => {
        setSelectedToken('');
        setAmount('');
        setRate('');
        // Use setTimeout to ensure the transaction is mined before refetching
        setTimeout(() => fetchListings(), 2000);
      },
    },
  });

  // Approve tokens function
  const { writeContract: approveTokens, isPending: isApproving, data: approveTxHash } = useWriteContract({
    mutation: {
      onSuccess: () => {
        // After approval, create the listing
        if (selectedToken && amount && rate) {
          createListing({
            address: LENDING_ESCROW_ADDRESS,
            abi: LendingEscrow__factory.abi,
            functionName: 'createListing',
            args: [
              selectedToken, 
              parseEther(amount), 
              parseEther(rate)
            ],
          });
        }
      },
    },
  });

  // Wait for transaction receipts
  const { isLoading: isCreateTxPending } = useWaitForTransactionReceipt({
    hash: createTxHash,
  });

  const { isLoading: isApproveTxPending } = useWaitForTransactionReceipt({
    hash: approveTxHash,
  });

  const publicClient = usePublicClient();
  
  const fetchListings = async () => {
    try {
      if (!listingCount || !publicClient) {
        setLoading(false);
        return;
      }

      const count = Number(listingCount);
      const listingPromises: Promise<Listing | null>[] = [];

      for (let i = 1; i <= count; i++) {
        listingPromises.push(
          (async (index: number): Promise<Listing | null> => {
            try {
              const listing = await publicClient.readContract({
                address: LENDING_ESCROW_ADDRESS,
                abi: LendingEscrow__factory.abi,
                functionName: 'listings',
                args: [BigInt(index)]
              }) as any; // Type assertion as the exact return type is complex
              
              if (listing && listing.isActive) {
                return {
                  id: index.toString(),
                  tokenId: listing.tokenId.toString(),
                  lender: listing.lender as string,
                  amount: formatEther(BigInt(listing.amount.toString())),
                  rate: formatEther(BigInt(listing.rate.toString())),
                  available: formatEther(BigInt(listing.available.toString())),
                  isActive: listing.isActive,
                };
              }
              return null;
            } catch (err) {
              console.error(`Error fetching listing ${index}:`, err);
              return null;
            }
          })(i)
        );
      }

      const listingResults = await Promise.all(listingPromises);
      const validListings = listingResults.filter((item): item is Listing => item !== null);
      setListings(validListings);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching listings:', err);
      setError('Failed to load listings');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (listingCount) {
      fetchListings();
    }
  }, [listingCount]);

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedToken || !amount || !rate) return;

    try {
      // First approve the escrow to spend tokens
      await approveTokens({
        address: SUBSCRIPTION_TOKEN_ADDRESS,
        abi: SubscriptionToken__factory.abi,
        functionName: 'setApprovalForAll',
        args: [LENDING_ESCROW_ADDRESS, true],
      });

      // Then create the listing
      await createListing({
        address: LENDING_ESCROW_ADDRESS,
        abi: LendingEscrow__factory.abi,
        functionName: 'createListing',
        args: [
          selectedToken,
          parseEther(amount),
          parseEther(rate)
        ],
      });
    } catch (err) {
      console.error('Error creating listing:', err);
      setError('Failed to create listing');
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading lending dashboard...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>;
  }

  return (
    <div className="space-y-8">
      {/* Create Listing Form */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Create New Listing</h2>
        <form onSubmit={handleCreateListing} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Token ID</label>
            <input
              type="text"
              value={selectedToken}
              onChange={(e) => setSelectedToken(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="Enter token ID"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="Enter amount to lend"
              step="0.000000000000000001"
              min="0"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Interest Rate (per second)</label>
            <input
              type="number"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="Enter interest rate"
              step="0.000000000000000001"
              min="0"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isApproving || isCreating}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isApproving || isApproveTxPending ? 'Approving...' : isCreating || isCreateTxPending ? 'Creating...' : 'Create Listing'}
          </button>
        </form>
      </div>

      {/* Active Listings */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Active Listings</h2>
        {listings.length === 0 ? (
          <p className="text-gray-500">No active listings found</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {listings.map((listing) => (
              <div key={listing.id} className="border p-4 rounded-lg">
                <h3 className="font-medium">Listing #{listing.id}</h3>
                <div className="mt-2 space-y-1 text-sm">
                  <p>Token ID: {listing.tokenId}</p>
                  <p>Lender: {`${listing.lender.slice(0, 6)}...${listing.lender.slice(-4)}`}</p>
                  <p>Amount: {listing.amount}</p>
                  <p>Rate: {listing.rate} per second</p>
                  <p>Available: {listing.available}</p>
                </div>
                <button
                  onClick={() => {
                    // Implement borrow functionality
                  }}
                  className="mt-3 w-full bg-green-600 text-white py-1 px-3 rounded text-sm hover:bg-green-700"
                >
                  Borrow
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

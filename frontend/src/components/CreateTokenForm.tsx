'use client';

'use client';

import { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { toast } from 'react-hot-toast';
import { SubscriptionToken__factory } from '@/contracts/typechain-types';
import { SUBSCRIPTION_TOKEN_ADDRESS } from '../config';

interface CreateTokenFormProps {
  onSuccess?: () => void;
}

export default function CreateTokenForm({ onSuccess }: CreateTokenFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    serviceId: '',
    timeUnit: 86400, // 1 day in seconds
    expiryDate: '',
    totalSupply: '',
  });

  const { address } = useAccount();
  const { 
    writeContract: createToken, 
    isPending: isCreating, 
    data: txHash,
    error
  } = useWriteContract({
    mutation: {
      onSuccess: () => {
        // The success handler will be called after the transaction is confirmed
      },
    },
  });

  // Handle transaction confirmation
  const { 
    isLoading: isConfirming, 
    isSuccess: isConfirmed,
    isError: isTxError,
    error: txError
  } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // Handle success and error states with useEffect
  useEffect(() => {
    if (isConfirmed) {
      toast.success('Token created successfully!');
      setFormData({
        serviceId: '',
        timeUnit: 86400,
        expiryDate: '',
        totalSupply: '',
      });
      if (onSuccess) onSuccess();
      setIsOpen(false);
      setIsLoading(false);
    }
  }, [isConfirmed, onSuccess]);

  // Handle errors
  useEffect(() => {
    if (error || txError) {
      const err = error || txError;
      console.error('Error creating token:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      toast.error(`Failed to create token: ${errorMessage}`);
      setIsLoading(false);
    }
  }, [error, txError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!address) {
      toast.error('Please connect your wallet');
      return;
    }

    try {
      setIsLoading(true);
      
      // Convert form data to appropriate types
      const timeUnit = Number(formData.timeUnit);
      const expiryTimestamp = Math.floor(new Date(formData.expiryDate).getTime() / 1000);
      const totalSupply = formData.totalSupply;

      // Create token
      await createToken({
        address: SUBSCRIPTION_TOKEN_ADDRESS,
        abi: SubscriptionToken__factory.abi,
        functionName: 'createToken',
        args: [
          formData.serviceId,
          timeUnit,
          expiryTimestamp,
          parseEther(totalSupply),
          address // recipient
        ]
      });
      
      // The rest of the success handling is done in the useWaitForTransactionReceipt hook
      setIsOpen(false);
    } catch (err) {
      console.error('Error creating token:', err);
      toast.error('Failed to create token');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="btn-primary"
      >
        Create New Token
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-xl w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Create Subscription Token</h3>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="serviceId" className="block text-sm font-medium text-gray-300 mb-1">
              Service ID
            </label>
            <input
              id="serviceId"
              type="text"
              value={formData.serviceId}
              onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
              className="input-field"
              placeholder="e.g., NETFLIX_PREMIUM"
              required
            />
          </div>

          <div>
            <label htmlFor="timeUnit" className="block text-sm font-medium text-gray-300 mb-1">
              Time Unit (seconds)
            </label>
            <select
              id="timeUnit"
              value={formData.timeUnit}
              onChange={(e) => setFormData({ ...formData, timeUnit: Number(e.target.value) })}
              className="input-field"
              required
            >
              <option value={3600}>1 Hour</option>
              <option value={86400}>1 Day</option>
              <option value={604800}>1 Week</option>
              <option value={2592000}>1 Month (30 days)</option>
            </select>
          </div>

          <div>
            <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-300 mb-1">
              Expiry Date
            </label>
            <input
              id="expiryDate"
              type="datetime-local"
              value={formData.expiryDate}
              onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              className="input-field"
              required
            />
          </div>

          <div>
            <label htmlFor="totalSupply" className="block text-sm font-medium text-gray-300 mb-1">
              Total Supply
            </label>
            <input
              id="totalSupply"
              type="number"
              step="0.000000000000000001"
              min="0"
              value={formData.totalSupply}
              onChange={(e) => setFormData({ ...formData, totalSupply: e.target.value })}
              className="input-field"
              placeholder="1.0"
              required
            />
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="btn-secondary"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex items-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </>
              ) : (
                'Create Token'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

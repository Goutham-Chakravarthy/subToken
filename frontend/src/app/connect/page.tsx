'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { Wallet, Shield, Zap, ArrowLeft, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { ConnectButton } from '@/components/ConnectButton';

export default function ConnectWalletPage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { connectors, connect, isPending, error } = useConnect();
  const { disconnect } = useDisconnect();
  const [selectedConnector, setSelectedConnector] = useState<any>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
  }, []);

  const handleConnect = (connector: any) => {
    setSelectedConnector(connector);
    connect({ connector });
  };

  const handleGoBack = () => {
    router.back();
  };

  const features = [
    {
      icon: Shield,
      title: 'Secure Connection',
      description: 'Your wallet remains secure with industry-standard encryption'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Connect instantly and start using TokenShare immediately'
    },
    {
      icon: Wallet,
      title: 'Multi-Wallet Support',
      description: 'Choose from popular wallets like MetaMask, WalletConnect, and more'
    }
  ];

  if (isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className={`bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl transform transition-all duration-1000 ${isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <div className="text-center">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-400" />
              </div>
              
              <h1 className="text-3xl font-bold text-white mb-4">
                Wallet Connected!
              </h1>
              
              <p className="text-gray-300 mb-6">
                Successfully connected to {address?.slice(0, 6)}...{address?.slice(-4)}
              </p>
              
              <div className="space-y-4">
                <button
                  onClick={handleGoBack}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105"
                >
                  Continue to App
                </button>
                
                <button
                  onClick={() => disconnect()}
                  className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-xl border border-white/20 transition-all duration-200"
                >
                  Disconnect Wallet
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <div className="p-6">
          <button
            onClick={handleGoBack}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-4xl w-full grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Side - Information */}
            <div className={`space-y-8 transform transition-all duration-1000 delay-200 ${isAnimating ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'}`}>
              <div>
                <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  Connect Your
                  <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> Wallet</span>
                </h1>
                <p className="text-xl text-gray-300 leading-relaxed">
                  Securely connect your wallet to access TokenShare's decentralized subscription sharing platform.
                </p>
              </div>

              {/* Features */}
              <div className="space-y-6">
                {features.map((feature, index) => (
                  <div 
                    key={index}
                    className={`flex items-start gap-4 transform transition-all duration-700 ${isAnimating ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`}
                    style={{ transitionDelay: `${600 + index * 200}ms` }}
                  >
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg mb-1">{feature.title}</h3>
                      <p className="text-gray-400">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side - Wallet Connection */}
            <div className={`transform transition-all duration-1000 delay-400 ${isAnimating ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`}>
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Wallet className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Choose Your Wallet</h2>
                  <p className="text-gray-400">Select a wallet to connect to TokenShare</p>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                    <p className="text-red-300 text-sm">{error.message}</p>
                  </div>
                )}

                {/* Wallet Options */}
                <div className="space-y-3 mb-6">
                  {connectors
                    .filter((connector, index, self) => 
                      index === self.findIndex((c) => c.name === connector.name)
                    )
                    .map((connector) => (
                    <button
                      key={connector.uid}
                      onClick={() => handleConnect(connector)}
                      disabled={isPending}
                      className={`w-full p-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl transition-all duration-200 flex items-center justify-between group ${
                        isPending && selectedConnector?.uid === connector.uid ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                          <Wallet className="w-5 h-5 text-purple-400" />
                        </div>
                        <span className="text-white font-medium">{connector.name}</span>
                      </div>
                      
                      {isPending && selectedConnector?.uid === connector.uid ? (
                        <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
                      ) : (
                        <div className="w-2 h-2 bg-purple-400 rounded-full transform group-hover:scale-150 transition-transform"></div>
                      )}
                    </button>
                  ))}
                </div>

                {/* Alternative Connection Method */}
                <div className="border-t border-white/10 pt-6">
                  <p className="text-gray-400 text-sm text-center mb-4">Or use RainbowKit</p>
                  <div className="flex justify-center">
                    <ConnectButton />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 text-center">
          <p className="text-gray-400 text-sm">
            By connecting your wallet, you agree to our{' '}
            <a href="#" className="text-purple-400 hover:text-purple-300 transition-colors">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-purple-400 hover:text-purple-300 transition-colors">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}

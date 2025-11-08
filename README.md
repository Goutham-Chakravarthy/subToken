# SubToken - Tokenized Subscription Marketplace

A decentralized platform that enables secure, time-limited sharing of digital subscriptions without exposing account credentials.

## 🌟 Features

### For Subscribers (Lenders)
- 🔒 Securely share subscription access without revealing credentials
- 💰 Monetize unused subscription time
- ⏱️ Set custom rental durations and pricing
- 📊 Track usage and earnings dashboard

### For Renters
- 🛒 Browse available subscriptions (Netflix, Prime, Spotify, etc.)
- ⏳ Rent only for the time you need
- 🔄 Seamless, secure access to services
- 💳 Multiple payment options (crypto/fiat)

### Security First
- 🔐 End-to-end credential encryption
- ⏱️ Time-bound access control
- 👁️ Session monitoring and auto-logout
- 🛡️ Fraud detection and prevention

## 🚀 Tech Stack

### Smart Contracts
- **Language**: Solidity (0.8.20+)
- **Framework**: Hardhat
- **Standards**: ERC-1155, ERC-20
- **Testnet**: Mumbai (Polygon)

### Frontend
- **Framework**: Next.js 14 (App Router)
- **UI**: Tailwind CSS, Shadcn/ui
- **State**: React Query, Zustand
- **Web3**: Wagmi, Viem

### Backend
- **Runtime**: Node.js
- **API**: Next.js API Routes
- **Database**: PostgreSQL (Supabase)
- **Authentication**: NextAuth.js

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+
- Yarn / npm
- Git
- Hardhat
- Foundry (optional)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/BHUVANBN/subToken.git
   cd subToken
   ```

2. Install dependencies
   ```bash
   # Install frontend dependencies
   cd frontendv2
   yarn install
   
   # Install contract dependencies
   cd ../contracts
   yarn install
   ```

3. Set up environment variables
   - Copy `.env.example` to `.env` in both `frontendv2` and `contracts` directories
   - Update the variables with your own values

4. Start development servers
   ```bash
   # In frontend directory
   yarn dev
   
   # In a new terminal, from contracts directory
   yarn hardhat node
   ```

## 📦 Project Structure

```
subToken/
├── contracts/           # Smart contracts
│   ├── contracts/       # Solidity source files
│   ├── test/            # Smart contract tests
│   └── scripts/         # Deployment scripts
│
├── frontendv2/          # Next.js frontend
│   ├── app/             # App router pages
│   ├── components/      # Reusable components
│   ├── lib/             # Utilities and configs
│   └── public/          # Static assets
│
└── README.md            # This file
```

## 📝 Smart Contracts

### Key Contracts
1. **SubscriptionToken.sol**
   - ERC-1155 based subscription tokens
   - Time-based access control
   - Role-based permissions

2. **LendingEscrow.sol**
   - Secure escrow for subscription rentals
   - Session management
   - Payment distribution

### Deployment
```bash
cd contracts
yarn hardhat run scripts/deploy.ts --network mumbai
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with ❤️ using Next.js, Hardhat, and OpenZeppelin
- Special thanks to all contributors

---

<div align="center">
  Made with 💖 by the SubToken Team
</div>

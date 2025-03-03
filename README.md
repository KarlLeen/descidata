# DeSciData - Decentralized Scientific Data Platform

[![GitHub license](https://img.shields.io/github/license/KarlLeen/descidata)](https://github.com/KarlLeen/descidata/blob/main/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/KarlLeen/descidata)](https://github.com/KarlLeen/descidata/stargazers)

DeSciData is an innovative blockchain-driven research data management and funding ecosystem designed to address issues of data integrity, accessibility, and funding in scientific research. The platform integrates decentralized storage, smart contracts, and NFT technology to create a transparent, secure, and efficient environment for researchers.

## Project Overview

DeSciData leverages blockchain technology and decentralized storage solutions to enable:

- Immutable and verifiable storage of research data
- NFT minting of datasets for ownership and copyright protection
- Crowdfunding of research projects using smart contracts
- Citation tracking and academic contribution recognition
- Transparency and verifiability of research outcomes

## Technical Architecture

This project consists of three main components:

### Frontend (Next.js + React)
- Modern, responsive user interface
- Blockchain wallet integration (MetaMask)
- Exploration and management of experiments and datasets

### Backend (Node.js + Express + TypeScript)
- RESTful API services
- Blockchain interaction services
- IPFS file management integration

### Smart Contracts (Solidity)
- Experiment management contract
- Data NFT contract
- Citation tracking
- Crowdfunding functionality

## Key Features

- **Experiment Management**: Create, update, and manage scientific experiments
- **Dataset Management**: Upload, store, and manage research datasets
- **NFT Minting**: Convert datasets into NFTs to protect intellectual property
- **Citation Tracking**: Track citations and usage of research data
- **Crowdfunding Mechanism**: Raise funds for promising scientific projects
- **Data Verification**: Ensure the integrity and authenticity of research data

## Getting Started

### Prerequisites

- Node.js v16+
- MetaMask browser extension
- Sepolia testnet account and ETH

### Installation

1. Clone the repository
```bash
git clone https://github.com/KarlLeen/descidata.git
cd descidata
```

2. Install dependencies
```bash
# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install
```

3. Configure environment variables

Create the necessary environment variable files:

**Backend (.env)**
```
PORT=5001
NODE_ENV=development
RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
PRIVATE_KEY=YOUR_PRIVATE_KEY
EXPERIMENT_CONTRACT_ADDRESS=0xBd4d685D6DD1e88310bBa33041292050535E60ec
PINATA_API_KEY=YOUR_PINATA_KEY
PINATA_API_SECRET=YOUR_PINATA_SECRET
PINATA_JWT=YOUR_PINATA_JWT
FRONTEND_URL=http://localhost:3000
```

**Frontend (.env.local)**
```
NEXT_PUBLIC_API_URL=http://localhost:5001
NEXT_PUBLIC_EXPERIMENT_CONTRACT_ADDRESS=0xBd4d685D6DD1e88310bBa33041292050535E60ec
NEXT_PUBLIC_DATA_NFT_CONTRACT_ADDRESS=YOUR_NFT_CONTRACT_ADDRESS
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
```

4. Start the application
```bash
# Start backend in one terminal window
cd backend
npm run dev

# Start frontend in another terminal window
cd frontend
npm run dev
```

Visit http://localhost:3000 to start using the application.

## Blockchain Integration

DeSciData is currently deployed on the Sepolia test network. You need to configure the Sepolia network in MetaMask and obtain test ETH.

Current contract address:
- Experiment Contract: `0xBd4d685D6DD1e88310bBa33041292050535E60ec`

## IPFS Integration

DeSciData uses Pinata as the IPFS service provider to enable:
- File uploads
- Metadata storage
- Content retrieval
- Gateway URL generation

## Development Roadmap

- Comprehensive test suite
- User authentication implementation
- Advanced data access control
- More detailed citation mechanisms
- Optimized blockchain interaction methods
- Enhanced error handling

## Contributions

Issues and pull requests are welcome. For major changes, please open an issue first to discuss the proposed modifications.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

- Project Maintainer: [Karl Leen](https://github.com/KarlLeen)
- Email: limlamleen@gmail.com

---

*DeSciData - Powering Decentralized Scientific Innovation*



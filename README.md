# DeSciData - Decentralized Scientific Data Platform

[![GitHub license](https://img.shields.io/github/license/KarlLeen/descidata)](https://github.com/KarlLeen/descidata/blob/main/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/KarlLeen/descidata)](https://github.com/KarlLeen/descidata/stargazers)

DeSciData is an innovative blockchain-driven research data management and funding ecosystem designed to address data integrity, access, and funding issues in scientific research. The platform combines decentralized storage, smart contracts, and NFT technology to create a transparent, secure, and efficient environment for researchers.

## Project Overview

DeSciData leverages blockchain technology and decentralized storage solutions to achieve:

- Immutable and verifiable storage of research data
- NFT minting of datasets for ownership and copyright protection
- Smart contract-based crowdfunding for research projects
- Citation tracking and recognition of academic contributions
- Transparency and verifiability of research outcomes

## Technical Architecture

The project consists of three main components:

### Frontend (Next.js + React)
- Modern, responsive user interface
- Blockchain wallet integration (MetaMask)
- Experiment and dataset browsing and management

### Backend (Node.js + Express + TypeScript)
- RESTful API services
- Blockchain interaction services
- IPFS file management integration

### Smart Contracts (Solidity)
- Experiment management contracts
- Data NFT contracts
- Citation tracking
- Crowdfunding functionality

## Key Features

- **Experiment Management**: Create, update, and manage scientific experiments
- **Dataset Management**: Upload, store, and manage research datasets
- **NFT Minting**: Convert datasets into NFTs to protect intellectual property
- **Citation Tracking**: Track citations and usage of research data
- **Crowdfunding Mechanism**: Raise funds for promising scientific projects
- **Data Validation**: Ensure the integrity and authenticity of research data

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
# Start the backend in one terminal window
cd backend
npm run dev

# Start the frontend in another terminal window
cd frontend
npm run dev
```

Visit http://localhost:3000 to start using the application.

## Blockchain Integration

DeSciData is currently deployed on the Sepolia testnet. You need to configure the Sepolia network in MetaMask and obtain test ETH.

Current contract addresses:
- Experiment Contract: `0xBd4d685D6DD1e88310bBa33041292050535E60ec`

## IPFS Integration

DeSciData uses Pinata as the IPFS service provider to implement:
- File uploads
- Metadata storage
- Content retrieval
- Gateway URL generation

## Development Plan

The project development is divided into three main phases, each containing quantifiable milestone objectives:

### Phase 1: Infrastructure & Core Features (6 weeks)

#### Milestone 1.1: User System & Authentication (2 weeks)
- [ ] Implement Web3 wallet integration, supporting at least 3 mainstream wallets
- [ ] Complete user profile system with researcher verification mechanism
- [ ] Achieve 95% authentication process success rate

#### Milestone 1.2: Data Management Foundation (2 weeks)
- [ ] Complete IPFS storage integration, supporting >100MB file uploads
- [ ] Implement dataset metadata standardization, covering 10+ fields
- [ ] Achieve 99% data upload success rate

#### Milestone 1.3: Smart Contract Deployment (2 weeks)
- [ ] Complete core contract testing with >90% test coverage
- [ ] Complete security audit, resolving all high-risk vulnerabilities
- [ ] Gas optimization, reducing transaction costs by 30%

### Phase 2: Feature Extension & Optimization (8 weeks)

#### Milestone 2.1: NFT Functionality Implementation (3 weeks)
- [ ] Implement dataset NFT minting functionality
- [ ] Complete NFT marketplace development
- [ ] Support at least 3 pricing models

#### Milestone 2.2: Citation System (2 weeks)
- [ ] Implement on-chain citation tracking
- [ ] Develop citation verification mechanism
- [ ] Achieve 99.9% citation accuracy

#### Milestone 2.3: User Interface Optimization (3 weeks)
- [ ] Implement responsive design, supporting all mainstream devices
- [ ] Optimize loading speed, first screen loading <2s
- [ ] Improve user experience score to 90+

### Phase 3: Ecosystem & Scalability (6 weeks)

#### Milestone 3.1: Crowdfunding System (2 weeks)
- [ ] Implement smart contract crowdfunding functionality
- [ ] Develop project evaluation mechanism
- [ ] Complete funds escrow system

#### Milestone 3.2: Data Validation Framework (2 weeks)
- [ ] Implement automated data validation
- [ ] Establish Peer Review system
- [ ] Achieve 95% validation accuracy

#### Milestone 3.3: API & Integration (2 weeks)
- [ ] Publish REST API documentation
- [ ] Provide SDK support
- [ ] API response time <100ms

## Progress Tracking

We use Gantt charts for real-time progress tracking, integrated into the project management system:

```typescript
// frontend/components/GanttChart/types.ts
export interface Milestone {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  progress: number;
  dependencies?: string[];
  kpis: {
    metric: string;
    target: number;
    current: number;
  }[];
}

// Implemented in frontend/components/GanttChart/index.tsx
// Using react-gantt-chart to integrate project progress visualization
```

Visit `/dashboard/progress` to view real-time project progress. The progress of each milestone is automatically updated through smart contract events, ensuring transparency and immutability.

## Contributing

Contributions are welcome through issues and pull requests. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

- Project Maintainer: [Karl Leen](https://github.com/KarlLeen)
- Email: limlamleen@gmail.com

---

*DeSciData - Powering Decentralized Scientific Innovation*

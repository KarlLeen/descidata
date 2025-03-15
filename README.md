# DeSciData - Decentralized Scientific Data Platform

[![GitHub license](https://img.shields.io/github/license/KarlLeen/descidata)](https://github.com/KarlLeen/descidata/blob/main/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/KarlLeen/descidata)](https://github.com/KarlLeen/descidata/stargazers)

DeSciData is an innovative blockchain-driven research data management and funding ecosystem designed to address issues of data integrity, accessibility, and funding in scientific research. The platform integrates decentralized storage, smart contracts, and NFT technology to create a transparent, secure, and efficient environment for researchers.

## Project Overview

DeSciData leverages blockchain technology and decentralized storage solutions to enable:

- Immutable and verifiable storage of research data
- NFT minting of datasets for ownership and copyright protection
- Smart contract-based crowdfunding for research projects
- Citation tracking and recognition of academic contributions
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
- Experiment management contracts
- Data NFT contracts
- Citation tracking
- Crowdfunding functionality
- Milestone tracking with KPI management
- Phase progress calculation

## Key Features

- **Experiment Management**: Create, update, and manage scientific experiments
- **Dataset Management**: Upload, store, and manage research datasets
- **NFT Minting**: Convert datasets into NFTs to protect intellectual property
- **Citation Tracking**: Track citations and usage of research data
- **Crowdfunding Mechanism**: Raise funds for promising scientific projects
- **Data Validation**: Ensure the integrity and authenticity of research data
- **Financial Policy**: Transparent financial management with automated refunds and profit distribution
- **Milestone Tracking**: Comprehensive tracking of project progress with KPIs and phase management
- **Frontend Testing Framework**: Automated testing for all key frontend functionalities

## Financial Policy

DeSciData implements a transparent and fair financial policy to ensure sustainable growth and equitable distribution of resources:

## Milestone Tracking System

DeSciData features a comprehensive milestone tracking system that enables transparent monitoring of project progress:

- **Three-Phase Structure**: Projects are organized into three main phases (Infrastructure & Core Features, Feature Extension, Ecosystem & Scalability)
- **Nine Milestone Framework**: Each phase contains three detailed milestones with specific deliverables
- **KPI Tracking**: Every milestone includes quantifiable Key Performance Indicators (KPIs) with target and current values
- **Progress Calculation**: Automatic calculation of milestone and phase progress based on KPI achievements
- **Role-Based Access**: Project managers can update milestone progress and KPI values

## Testing Framework

The platform includes a robust testing framework to ensure quality and reliability:

- **Frontend Tests**: Comprehensive Cypress tests for all key frontend functionalities
- **Mock Server**: A dedicated mock server for testing frontend components without backend dependencies
- **Test Runner**: Interactive test runner with options for headless or browser-based testing
- **Continuous Integration**: Tests can be integrated into CI/CD pipelines for automated quality assurance

### Funding Mechanism
- **Platform Fee**: A 5% fee is applied only to successfully funded projects
- **Full Refund Guarantee**: All contributions are automatically refunded if funding goals are not met by the deadline
- **Transparent Transactions**: All financial transactions are recorded on-chain for full transparency

### Yield Management
- **Low-Risk Investment**: Idle funds are pooled into SEC-compliant treasury bonds generating 2-4% annual yield
- **Quarterly Profit Distribution**:
  - 70% to researchers
  - 20% to sponsors
  - 10% to platform reserves

For more details, see the [Financial Policy Documentation](./docs/FinancialPolicy.md).

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

DeSciData is currently deployed on the Sepolia test network. You need to configure the Sepolia network in MetaMask and obtain test ETH.

Current contract address:
- Experiment Contract: `0xBd4d685D6DD1e88310bBa33041292050535E60ec`

## IPFS Integration

DeSciData uses Pinata as the IPFS service provider to enable:
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
- [x] Implement smart contract crowdfunding functionality
- [x] Implement transparent financial policy with refund mechanism
- [x] Complete funds escrow and yield distribution system
- [ ] Develop project evaluation mechanism

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
<<<<<<< HEAD
=======


>>>>>>> 295bb5bfb5c00ae2476c90860cefa51d3adad902

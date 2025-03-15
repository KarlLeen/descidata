# DeSciData Backend API

This is the backend API service for the DeSciData platform, providing experiment and dataset management through RESTful endpoints.

## Features

- Full experiment management API
- Dataset upload and management with IPFS integration
- Blockchain integration with Ethereum 
- Secure access control for datasets
- NFT conversion for datasets
- Citation tracking support

## Technology Stack

- Node.js with TypeScript
- Express.js web framework
- ethers.js for Ethereum interaction
- IPFS HTTP Client for decentralized storage
- Multer for file uploads

## Getting Started

### Prerequisites

- Node.js v14 or later
- NPM or Yarn
- Access to an Ethereum node (Infura, Alchemy, etc.)
- IPFS account (Infura recommended)

### Installation

1. Clone the repository and navigate to the backend directory:
```bash
git clone https://github.com/yourusername/descidata.git
cd descidata/backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

4. Edit the `.env` file and set your configuration:
```
# Server Configuration
PORT=5000
NODE_ENV=development

# Blockchain Configuration
RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_API_KEY
PRIVATE_KEY=your_private_key_here_without_0x_prefix
EXPERIMENT_CONTRACT_ADDRESS=0xBd4d685D6DD1e88310bBa33041292050535E60ec

# IPFS Configuration
IPFS_PROJECT_ID=your_infura_ipfs_project_id
IPFS_PROJECT_SECRET=your_infura_ipfs_project_secret
IPFS_API_URL=https://ipfs.infura.io:5001

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

5. Build the TypeScript code:
```bash
npm run build
```

6. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## API Endpoints

### Experiments

- **GET /api/experiments**
  - Get all experiments
  - Returns a list of all experiments

- **GET /api/experiments/:id**
  - Get a specific experiment by ID
  - Returns detailed experiment information

- **POST /api/experiments**
  - Create a new experiment
  - Body parameters:
    ```json
    {
      "title": "Experiment Title",
      "description": "Detailed description of the experiment",
      "fundingGoal": "1.5",
      "durationInDays": 30
    }
    ```

- **POST /api/experiments/:id/fund**
  - Fund an existing experiment
  - Body parameters:
    ```json
    {
      "amount": "0.5"
    }
    ```

### Datasets

- **POST /api/experiments/:experimentId/datasets**
  - Upload a dataset for an experiment
  - Multipart form data:
    - title: Dataset title
    - description: Dataset description
    - accessPrice: Access price in ETH
    - isOpenAccess: Boolean indicating if the dataset is open access
    - file: The dataset file

- **GET /api/experiments/datasets/:id**
  - Get dataset information by ID
  - Returns metadata about the dataset

- **GET /api/experiments/datasets/:id/content**
  - Get the actual dataset content
  - Requires appropriate access rights

- **POST /api/experiments/datasets/:id/nft**
  - Convert a dataset to an NFT
  - No body parameters required

- **POST /api/experiments/datasets/:id/cite**
  - Cite a dataset from another dataset
  - Body parameters:
    ```json
    {
      "citedDatasetId": "2"
    }
    ```

## Error Handling

API responses follow this structure:

- Success:
```json
{
  "success": true,
  "data": { /* response data */ }
}
```

- Error:
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information (development only)"
}
```

## IPFS Integration

The backend uses Infura's IPFS service for storing dataset files and metadata. When a dataset is uploaded:

1. The file is uploaded to IPFS and a CID is generated
2. Metadata containing the file reference is created and uploaded to IPFS
3. The metadata URI is stored in the smart contract

## Blockchain Integration

The backend interacts with the Ethereum blockchain through the DeSciData smart contract, which handles:

- Experiment creation and management
- Funding operations
- Dataset registration and access control
- NFT conversion for datasets
- Citation tracking

## Security Considerations

- The service uses environment variables for sensitive configuration
- The private key is used for signing transactions on behalf of the service
- CORS is configured to only allow requests from the specified frontend URL

## License

This project is licensed under the MIT License

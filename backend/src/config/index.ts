import dotenv from 'dotenv';
dotenv.config();

const config = {
  server: {
    port: process.env.PORT || 5000,
    env: process.env.NODE_ENV || 'development'
  },
  blockchain: {
    rpcUrl: process.env.RPC_URL || 'https://sepolia.infura.io/v3/your-infura-api-key',
    privateKey: process.env.PRIVATE_KEY || '',
    experimentContractAddress: process.env.EXPERIMENT_CONTRACT_ADDRESS || '0xBd4d685D6DD1e88310bBa33041292050535E60ec'
  },
  ipfs: {
    // Pinata配置
    pinataApiKey: process.env.PINATA_API_KEY || '',
    pinataApiSecret: process.env.PINATA_API_SECRET || '',
    pinataJWT: process.env.PINATA_JWT || ''
  },
  cors: {
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000'
  }
};

export default config;

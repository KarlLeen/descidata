import { ethers } from 'ethers';
import config from '../config';
import * as fs from 'fs';
import * as path from 'path';

// 导入合约ABI
const contractPath = path.join(__dirname, '../../../artifacts/contracts/DeSciData.sol/DeSciData.json');
const contractJson = JSON.parse(fs.readFileSync(contractPath, 'utf8'));
const contractABI = contractJson.abi;

// 数据结构
interface Experiment {
  id: number;
  title: string;
  description: string;
  fundingGoal: string;
  currentFunding: string;
  owner: string;
  createdAt: number;
  datasets: number[];
}

interface Dataset {
  id: number;
  experimentId: number;
  name: string;
  metadataHash: string;
  creator: string;
  createdAt: number;
  isNFT: boolean;
  citations: number[];
}

// 单例模式
class BlockchainService {
  private static instance: BlockchainService;
  private provider: ethers.providers.JsonRpcProvider;
  private wallet: ethers.Wallet;
  private contract: ethers.Contract;

  constructor() {
    this.provider = new ethers.providers.JsonRpcProvider(config.blockchain.rpcUrl);
    
    if (!config.blockchain.privateKey) {
      console.warn('警告: 未设置私钥，只能执行只读操作');
      this.wallet = ethers.Wallet.createRandom();
    } else {
      this.wallet = new ethers.Wallet(config.blockchain.privateKey, this.provider);
    }
    
    this.contract = new ethers.Contract(
      config.blockchain.experimentContractAddress,
      contractABI,
      this.wallet
    );
  }

  public static getInstance(): BlockchainService {
    if (!BlockchainService.instance) {
      BlockchainService.instance = new BlockchainService();
    }
    return BlockchainService.instance;
  }

  // 获取所有实验
  async getAllExperiments(): Promise<Experiment[]> {
    // 调用智能合约获取实验数量
    const count = await this.contract.getExperimentCount();
    const experiments: Experiment[] = [];
    
    // 获取所有实验详情
    for (let i = 0; i < count; i++) {
      try {
        const experiment = await this.getExperimentById(i);
        if (experiment) {
          experiments.push(experiment);
        }
      } catch (error) {
        console.error(`Error getting experiment ${i}:`, error);
      }
    }
    
    return experiments;
  }

  // 通过ID获取实验
  async getExperimentById(id: number): Promise<Experiment | null> {
    try {
      const experiment = await this.contract.experiments(id);
      
      // 获取该实验的数据集
      const datasetCount = await this.contract.getDatasetCount(id);
      const datasets: number[] = [];
      
      for (let i = 0; i < datasetCount; i++) {
        datasets.push(i);
      }
      
      return {
        id: id,
        title: experiment.title,
        description: experiment.description,
        fundingGoal: ethers.utils.formatEther(experiment.fundingGoal),
        currentFunding: ethers.utils.formatEther(experiment.currentFunding),
        owner: experiment.owner,
        createdAt: experiment.createdAt.toNumber(),
        datasets
      };
    } catch (error) {
      console.error(`Error getting experiment with ID ${id}:`, error);
      return null;
    }
  }

  // 创建新实验
  async createExperiment(
    title: string, 
    description: string, 
    fundingGoal: number,
    ownerAddress: string
  ): Promise<number> {
    const tx = await this.contract.createExperiment(
      title,
      description,
      ethers.utils.parseEther(fundingGoal.toString()),
      { from: ownerAddress }
    );
    
    const receipt = await tx.wait();
    
    // 从事件中获取experimentId
    const event = receipt.events?.find((e: any) => e.event === 'ExperimentCreated');
    const experimentId = event?.args?.experimentId;
    
    return experimentId;
  }

  // 为实验提供资金
  async fundExperiment(
    experimentId: number, 
    amount: number,
    funderAddress: string
  ): Promise<string> {
    const tx = await this.contract.fundExperiment(
      experimentId,
      { 
        value: ethers.utils.parseEther(amount.toString()),
        from: funderAddress
      }
    );
    
    const receipt = await tx.wait();
    return receipt.transactionHash;
  }

  // 添加数据集到实验
  async addDatasetToExperiment(
    experimentId: number,
    name: string,
    metadataHash: string,
    researcherAddress: string
  ): Promise<number> {
    const tx = await this.contract.addDataset(
      experimentId,
      name,
      metadataHash,
      { from: researcherAddress }
    );
    
    const receipt = await tx.wait();
    
    // 从事件中获取datasetId
    const event = receipt.events?.find((e: any) => e.event === 'DatasetAdded');
    const datasetId = event?.args?.datasetId;
    
    return datasetId;
  }

  // 获取实验的所有数据集
  async getExperimentDatasets(experimentId: number): Promise<Dataset[]> {
    const datasetCount = await this.contract.getDatasetCount(experimentId);
    const datasets: Dataset[] = [];
    
    for (let i = 0; i < datasetCount; i++) {
      try {
        const dataset = await this.getDatasetById(experimentId, i);
        if (dataset) {
          datasets.push(dataset);
        }
      } catch (error) {
        console.error(`Error getting dataset ${i} for experiment ${experimentId}:`, error);
      }
    }
    
    return datasets;
  }

  // 获取数据集详情
  async getDatasetById(experimentId: number, datasetId: number): Promise<Dataset | null> {
    try {
      const dataset = await this.contract.datasets(experimentId, datasetId);
      
      // 获取引用信息
      const citationCount = await this.contract.getCitationCount(experimentId, datasetId);
      const citations: number[] = [];
      
      for (let i = 0; i < citationCount; i++) {
        citations.push(i);
      }
      
      return {
        id: datasetId,
        experimentId,
        name: dataset.name,
        metadataHash: dataset.metadataHash,
        creator: dataset.creator,
        createdAt: dataset.createdAt.toNumber(),
        isNFT: dataset.isNFT,
        citations
      };
    } catch (error) {
      console.error(`Error getting dataset with ID ${datasetId} for experiment ${experimentId}:`, error);
      return null;
    }
  }

  // 将数据集铸造为NFT
  async mintDatasetNFT(
    experimentId: number,
    datasetId: number,
    researcherAddress: string
  ): Promise<string> {
    const tx = await this.contract.mintDatasetNFT(
      experimentId,
      datasetId,
      { from: researcherAddress }
    );
    
    const receipt = await tx.wait();
    return receipt.transactionHash;
  }

  // 引用数据集
  async citeDataset(
    experimentId: number,
    datasetId: number,
    citerAddress: string,
    citationContext: string
  ): Promise<number> {
    const tx = await this.contract.citeDataset(
      experimentId,
      datasetId,
      citationContext,
      { from: citerAddress }
    );
    
    const receipt = await tx.wait();
    
    // 从事件中获取citationId
    const event = receipt.events?.find((e: any) => e.event === 'DatasetCited');
    const citationId = event?.args?.citationId;
    
    return citationId;
  }
}

// 导出单例模式下的区块链服务
export default BlockchainService.getInstance();

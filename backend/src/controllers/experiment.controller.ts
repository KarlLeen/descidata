import { Request, Response } from 'express';
import blockchainService from '../services/blockchain.service';
import ipfsService from '../services/ipfs.service';

// 获取所有实验
export const getAllExperiments = async (req: Request, res: Response): Promise<void> => {
  try {
    const experiments = await blockchainService.getAllExperiments();
    res.status(200).json({ success: true, data: experiments });
  } catch (error) {
    console.error('获取实验列表失败:', error);
    res.status(500).json({ success: false, message: '获取实验列表失败', error: (error as Error).message });
  }
};

// 获取单个实验详情
export const getExperimentById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const experiment = await blockchainService.getExperimentById(Number(id));
    
    if (!experiment) {
      res.status(404).json({ success: false, message: '实验不存在' });
      return;
    }
    
    res.status(200).json({ success: true, data: experiment });
  } catch (error) {
    console.error('获取实验失败:', error);
    res.status(500).json({ success: false, message: '获取实验失败', error: (error as Error).message });
  }
};

// 创建新实验
export const createExperiment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, fundingGoal, ownerAddress } = req.body;
    
    if (!title || !description || !fundingGoal || !ownerAddress) {
      res.status(400).json({ 
        success: false, 
        message: '缺少必要参数', 
        requiredFields: ['title', 'description', 'fundingGoal', 'ownerAddress'] 
      });
      return;
    }
    
    const experimentId = await blockchainService.createExperiment(
      title, 
      description, 
      Number(fundingGoal), 
      ownerAddress
    );
    
    res.status(201).json({ 
      success: true, 
      message: '实验创建成功', 
      data: { experimentId } 
    });
  } catch (error) {
    console.error('创建实验失败:', error);
    res.status(500).json({ success: false, message: '创建实验失败', error: (error as Error).message });
  }
};

// 为实验提供资金
export const fundExperiment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { amount, funderAddress } = req.body;
    
    if (!amount || !funderAddress) {
      res.status(400).json({ 
        success: false, 
        message: '缺少必要参数', 
        requiredFields: ['amount', 'funderAddress'] 
      });
      return;
    }
    
    const txHash = await blockchainService.fundExperiment(
      Number(id),
      Number(amount),
      funderAddress
    );
    
    res.status(200).json({ 
      success: true, 
      message: '资金提供成功', 
      data: { transactionHash: txHash } 
    });
  } catch (error) {
    console.error('提供资金失败:', error);
    res.status(500).json({ success: false, message: '提供资金失败', error: (error as Error).message });
  }
};

// 上传数据集
export const uploadDataset = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: '没有文件上传' });
      return;
    }
    
    const { id: experimentId } = req.params;
    const { name, description, researcherAddress } = req.body;
    
    if (!name || !description || !researcherAddress) {
      res.status(400).json({ 
        success: false, 
        message: '缺少必要参数', 
        requiredFields: ['name', 'description', 'researcherAddress'] 
      });
      return;
    }
    
    // 上传文件到IPFS
    const fileBuffer = req.file.buffer;
    const fileUploadResult = await ipfsService.uploadFile(fileBuffer);
    
    // 准备元数据
    const metadata = {
      name,
      description,
      experimentId: Number(experimentId),
      researcherAddress,
      fileType: req.file.mimetype,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      timestamp: new Date().toISOString(),
      fileHash: fileUploadResult.IpfsHash
    };
    
    // 上传元数据到IPFS
    const metadataUploadResult = await ipfsService.uploadMetadata(metadata);
    
    // 在区块链上注册数据集
    const datasetId = await blockchainService.addDatasetToExperiment(
      Number(experimentId),
      name,
      metadataUploadResult.IpfsHash,
      researcherAddress
    );
    
    res.status(201).json({ 
      success: true, 
      message: '数据集上传成功', 
      data: { 
        datasetId,
        fileIpfsHash: fileUploadResult.IpfsHash,
        metadataIpfsHash: metadataUploadResult.IpfsHash
      } 
    });
  } catch (error) {
    console.error('上传数据集失败:', error);
    res.status(500).json({ success: false, message: '上传数据集失败', error: (error as Error).message });
  }
};

// 获取实验的数据集列表
export const getDatasets = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id: experimentId } = req.params;
    const datasets = await blockchainService.getExperimentDatasets(Number(experimentId));
    
    res.status(200).json({ success: true, data: datasets });
  } catch (error) {
    console.error('获取数据集失败:', error);
    res.status(500).json({ success: false, message: '获取数据集失败', error: (error as Error).message });
  }
};

// 获取数据集内容
export const getDatasetContent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { experimentId, datasetId } = req.params;
    
    const datasetInfo = await blockchainService.getDatasetById(
      Number(experimentId), 
      Number(datasetId)
    );
    
    if (!datasetInfo || !datasetInfo.metadataHash) {
      res.status(404).json({ success: false, message: '数据集不存在或元数据缺失' });
      return;
    }
    
    // 从IPFS获取元数据
    const metadata = await ipfsService.getMetadata(datasetInfo.metadataHash);
    
    // 准备数据集内容响应
    const datasetContent = {
      ...datasetInfo,
      metadata,
      fileUrl: ipfsService.getGatewayUrl(metadata.fileHash)
    };
    
    res.status(200).json({ 
      success: true, 
      data: datasetContent 
    });
  } catch (error) {
    console.error('获取数据集内容失败:', error);
    res.status(500).json({ success: false, message: '获取数据集内容失败', error: (error as Error).message });
  }
};

// 将数据集转换为NFT
export const mintDatasetAsNFT = async (req: Request, res: Response): Promise<void> => {
  try {
    const { experimentId, datasetId } = req.params;
    const { researcherAddress } = req.body;
    
    if (!researcherAddress) {
      res.status(400).json({ 
        success: false, 
        message: '缺少必要参数', 
        requiredFields: ['researcherAddress'] 
      });
      return;
    }
    
    // 首先获取数据集信息
    const datasetInfo = await blockchainService.getDatasetById(
      Number(experimentId), 
      Number(datasetId)
    );
    
    if (!datasetInfo || !datasetInfo.metadataHash) {
      res.status(404).json({ success: false, message: '数据集不存在或元数据缺失' });
      return;
    }
    
    // 铸造NFT
    const txHash = await blockchainService.mintDatasetNFT(
      Number(experimentId),
      Number(datasetId), 
      researcherAddress
    );
    
    res.status(200).json({ 
      success: true, 
      message: '数据集已成功NFT化', 
      data: { 
        nftTransactionHash: txHash,
        experimentId: Number(experimentId),
        datasetId: Number(datasetId)
      } 
    });
  } catch (error) {
    console.error('NFT化数据集失败:', error);
    res.status(500).json({ success: false, message: 'NFT化数据集失败', error: (error as Error).message });
  }
};

// 引用数据集（创建引用记录）
export const citeDataset = async (req: Request, res: Response): Promise<void> => {
  try {
    const { experimentId, datasetId } = req.params;
    const { citerAddress, citationContext } = req.body;
    
    if (!citerAddress) {
      res.status(400).json({ 
        success: false, 
        message: '缺少必要参数', 
        requiredFields: ['citerAddress'] 
      });
      return;
    }
    
    const citationId = await blockchainService.citeDataset(
      Number(experimentId),
      Number(datasetId),
      citerAddress,
      citationContext || ''
    );
    
    res.status(201).json({ 
      success: true, 
      message: '数据集引用成功创建', 
      data: { citationId } 
    });
  } catch (error) {
    console.error('引用数据集失败:', error);
    res.status(500).json({ success: false, message: '引用数据集失败', error: (error as Error).message });
  }
};

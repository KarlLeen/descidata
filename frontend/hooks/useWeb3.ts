import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

const CONTRACT_ABI = [
  {
    name: 'getMilestone',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'milestoneId', type: 'string' }],
    outputs: [{
      type: 'tuple',
      components: [
        { name: 'id', type: 'string' },
        { name: 'name', type: 'string' },
        { name: 'targetProgress', type: 'uint256' },
        { name: 'currentProgress', type: 'uint256' },
        { name: 'exists', type: 'bool' },
        {
          name: 'kpis',
          type: 'tuple[]',
          components: [
            { name: 'metric', type: 'string' },
            { name: 'target', type: 'uint256' },
            { name: 'current', type: 'uint256' }
          ]
        }
      ]
    }]
  },
  {
    name: 'getPhaseProgress',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'phaseId', type: 'string' }],
    outputs: [{ type: 'uint256' }]
  },
  {
    name: 'updateMilestoneProgress',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'milestoneId', type: 'string' },
      { name: 'progress', type: 'uint256' }
    ],
    outputs: []
  },
  {
    name: 'updateMilestoneKPI',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'milestoneId', type: 'string' },
      { name: 'kpiIndex', type: 'uint256' },
      { name: 'value', type: 'uint256' }
    ],
    outputs: []
  },
  {
    name: 'projectManagers',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'manager', type: 'address' }],
    outputs: [{ type: 'bool' }]
  },
  {
    name: 'uploadMilestoneData',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'milestoneId', type: 'string' },
      { name: 'dataURI', type: 'string' }
    ],
    outputs: [{ type: 'bool' }]
  },
  {
    name: 'getMilestoneData',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'milestoneId', type: 'string' }],
    outputs: [{
      type: 'tuple[]',
      components: [
        { name: 'id', type: 'string' },
        { name: 'title', type: 'string' },
        { name: 'dataURI', type: 'string' },
        { name: 'timestamp', type: 'uint256' },
        { name: 'uploader', type: 'address' }
      ]
    }]
  }
] as const;

export interface KPI {
  metric: string;
  target: number;
  current: number;
}

export interface MilestoneData {
  id: string;
  title: string;
  dataURI: string;
  timestamp: number;
  uploader: string;
}

export interface Milestone {
  id: string;
  name: string;
  targetProgress: number;
  currentProgress: number;
  kpis: KPI[];
  exists: boolean;
  data?: MilestoneData[];
}

interface Web3State {
  account: string | null;
  contract: ethers.Contract | null;
  isConnected: boolean;
  isProjectManager: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  getMilestone: (milestoneId: string) => Promise<Milestone | null>;
  getPhaseProgress: (phaseId: string) => Promise<number>;
  updateMilestoneProgress: (milestoneId: string, progress: number) => Promise<boolean>;
  updateMilestoneKPI: (milestoneId: string, kpiIndex: number, value: number) => Promise<boolean>;
  uploadMilestoneData: (milestoneId: string, dataURI: string) => Promise<boolean>;
  getMilestoneData: (milestoneId: string) => Promise<MilestoneData[]>;
}

export function useWeb3(): Web3State {
  const { address, isConnected } = useAccount();
  const { connectAsync, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [isProjectManager, setIsProjectManager] = useState<boolean>(false);

  useEffect(() => {
    const initContract = async () => {
      if (!address) return;

      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contractAddress = process.env.NEXT_PUBLIC_EXPERIMENT_CONTRACT_ADDRESS;
        const contractABI = CONTRACT_ABI;
        
        const projectContract = new ethers.Contract(
          contractAddress!,
          contractABI,
          signer
        );
        
        setContract(projectContract);

        // Check if the connected account is a project manager
        const isManager = await projectContract.projectManagers(address);
        setIsProjectManager(isManager);
      } catch (error) {
        console.error('Error initializing contract:', error);
      }
    };

    initContract();
  }, [address]);

  const handleConnect = async () => {
    try {
      const connector = connectors[0]; // Using the first available connector (usually MetaMask)
      await connectAsync({ connector });
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  const getMilestone = async (milestoneId: string): Promise<Milestone | null> => {
    if (!contract) return null;
    try {
      const milestone = await contract.getMilestone(milestoneId);
      return {
        id: milestone.id,
        name: milestone.name,
        targetProgress: Number(milestone.targetProgress),
        currentProgress: Number(milestone.currentProgress),
        kpis: milestone.kpis.map((kpi: any) => ({
          metric: kpi.metric,
          target: Number(kpi.target),
          current: Number(kpi.current)
        })),
        exists: milestone.exists
      };
    } catch (error) {
      console.error('获取里程碑信息失败:', error);
      return null;
    }
  };

  const getPhaseProgress = async (phaseId: string): Promise<number> => {
    if (!contract) return 0;
    try {
      const progress = await contract.getPhaseProgress(phaseId);
      return Number(progress);
    } catch (error) {
      console.error('获取阶段进度失败:', error);
      return 0;
    }
  };

  const updateMilestoneProgress = async (milestoneId: string, progress: number): Promise<boolean> => {
    if (!contract || !isProjectManager) return false;
    try {
      const tx = await contract.updateMilestoneProgress(milestoneId, progress);
      await tx.wait();
      return true;
    } catch (error) {
      console.error('更新里程碑进度失败:', error);
      return false;
    }
  };

  const updateMilestoneKPI = async (milestoneId: string, kpiIndex: number, value: number): Promise<boolean> => {
    if (!contract || !isProjectManager) return false;
    try {
      const tx = await contract.updateMilestoneKPI(milestoneId, kpiIndex, value);
      await tx.wait();
      return true;
    } catch (error) {
      console.error('更新KPI失败:', error);
      return false;
    }
  };

  const uploadMilestoneData = async (milestoneId: string, dataURI: string): Promise<boolean> => {
    if (!contract || !isProjectManager) return false;
    try {
      const tx = await contract.uploadMilestoneData(milestoneId, dataURI);
      await tx.wait();
      return true;
    } catch (error) {
      console.error('上传数据失败:', error);
      return false;
    }
  };

  const getMilestoneData = async (milestoneId: string): Promise<MilestoneData[]> => {
    if (!contract) return [];
    try {
      const data = await contract.getMilestoneData(milestoneId);
      return data.map((item: any) => ({
        id: item.id,
        title: item.title,
        dataURI: item.dataURI,
        timestamp: Number(item.timestamp),
        uploader: item.uploader
      }));
    } catch (error) {
      console.error('获取里程碑数据失败:', error);
      return [];
    }
  };

  return {
    account: address || null,
    contract,
    isConnected,
    isProjectManager,
    connect: handleConnect,
    disconnect,
    getMilestone,
    getPhaseProgress,
    updateMilestoneProgress,
    updateMilestoneKPI,
    uploadMilestoneData,
    getMilestoneData
  };
}

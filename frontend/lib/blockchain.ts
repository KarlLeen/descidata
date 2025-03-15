import { ethers } from "ethers"
import { abi as ExperimentABI } from "@/contracts/ExperimentABI.json"
import { abi as DataNFTABI } from "@/contracts/DataNFTABI.json"

// 合约地址
const EXPERIMENT_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_EXPERIMENT_CONTRACT_ADDRESS
const DATA_NFT_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_DATA_NFT_CONTRACT_ADDRESS

// 获取以太坊提供者
export const getProvider = () => {
  if (typeof window !== "undefined" && window.ethereum) {
    return new ethers.BrowserProvider(window.ethereum)
  }

  // 如果没有 MetaMask，使用公共 RPC
  return new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL || "https://rpc.educhain.network")
}

// 获取签名者（需要用户连接钱包）
export const getSigner = async () => {
  const provider = getProvider()

  if (provider instanceof ethers.BrowserProvider) {
    // 请求用户连接钱包
    await provider.send("eth_requestAccounts", [])
    return provider.getSigner()
  }

  throw new Error("请连接 MetaMask 钱包")
}

// 实验合约接口
export const experimentContract = {
  // 获取所有实验
  getAllExperiments: async () => {
    const provider = getProvider()
    const contract = new ethers.Contract(EXPERIMENT_CONTRACT_ADDRESS as string, ExperimentABI, provider)

    const count = await contract.getExperimentCount()
    const experiments = []

    for (let i = 0; i < count; i++) {
      const experimentId = await contract.experimentIds(i)
      const experiment = await contract.experiments(experimentId)
      experiments.push({
        id: experimentId,
        title: experiment.title,
        description: experiment.description,
        fundingGoal: ethers.formatEther(experiment.fundingGoal),
        fundingRaised: ethers.formatEther(experiment.fundingRaised),
        status: experiment.status,
        author: experiment.author,
        contractAddress: EXPERIMENT_CONTRACT_ADDRESS,
        // 其他字段...
      })
    }

    return experiments
  },

  // 获取单个实验
  getExperiment: async (id: string) => {
    const provider = getProvider()
    const contract = new ethers.Contract(EXPERIMENT_CONTRACT_ADDRESS as string, ExperimentABI, provider)

    const experiment = await contract.experiments(id)
    return {
      id,
      title: experiment.title,
      description: experiment.description,
      fundingGoal: ethers.formatEther(experiment.fundingGoal),
      fundingRaised: ethers.formatEther(experiment.fundingRaised),
      status: experiment.status,
      author: experiment.author,
      contractAddress: EXPERIMENT_CONTRACT_ADDRESS,
      // 其他字段...
    }
  },

  // 创建新实验
  createExperiment: async (data: any) => {
    const signer = await getSigner()
    const contract = new ethers.Contract(EXPERIMENT_CONTRACT_ADDRESS as string, ExperimentABI, signer)

    const tx = await contract.createExperiment(
      data.title,
      data.description,
      ethers.parseEther(data.fundingGoal.toString()),
      // 其他参数...
    )

    await tx.wait()
    return tx
  },

  // 为实验提供资金
  fundExperiment: async (id: string, amount: string) => {
    const signer = await getSigner()
    const contract = new ethers.Contract(EXPERIMENT_CONTRACT_ADDRESS as string, ExperimentABI, signer)

    const tx = await contract.fundExperiment(id, {
      value: ethers.parseEther(amount),
    })

    await tx.wait()
    return tx
  },
}

// 数据 NFT 合约接口
export const dataNFTContract = {
  // 创建数据 NFT
  createDataNFT: async (experimentId: string, metadata: any) => {
    const signer = await getSigner()
    const contract = new ethers.Contract(DATA_NFT_CONTRACT_ADDRESS as string, DataNFTABI, signer)

    // 上传元数据到 IPFS
    const metadataURI = await uploadToIPFS(metadata)

    const tx = await contract.mintDataNFT(experimentId, metadataURI)
    await tx.wait()
    return tx
  },

  // 获取用户拥有的数据 NFT
  getUserDataNFTs: async (address: string) => {
    const provider = getProvider()
    const contract = new ethers.Contract(DATA_NFT_CONTRACT_ADDRESS as string, DataNFTABI, provider)

    const balance = await contract.balanceOf(address)
    const nfts = []

    for (let i = 0; i < balance; i++) {
      const tokenId = await contract.tokenOfOwnerByIndex(address, i)
      const tokenURI = await contract.tokenURI(tokenId)
      const metadata = await fetchIPFSMetadata(tokenURI)

      nfts.push({
        tokenId: tokenId.toString(),
        metadata,
        // 其他字段...
      })
    }

    return nfts
  },
}

// 辅助函数：上传到 IPFS
async function uploadToIPFS(data: any) {
  // 这里可以使用 IPFS 客户端库，如 ipfs-http-client
  // 或者使用第三方服务如 Pinata、Infura 等
  // 示例代码仅作参考
  const response = await fetch("/api/upload-to-ipfs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  const { ipfsHash } = await response.json()
  return `ipfs://${ipfsHash}`
}

// 辅助函数：从 IPFS 获取元数据
async function fetchIPFSMetadata(uri: string) {
  // 将 ipfs:// URI 转换为 HTTP 网关 URL
  const ipfsGateway = "https://ipfs.io/ipfs/"
  const httpUrl = uri.replace("ipfs://", ipfsGateway)

  const response = await fetch(httpUrl)
  return response.json()
}


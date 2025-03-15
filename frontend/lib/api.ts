// 基础 API 请求函数
export async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  // 使用相对路径访问 Next.js API 路由
  const url = endpoint

  const defaultOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
    },
  }

  const response = await fetch(url, { ...defaultOptions, ...options })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(error || `API 请求失败: ${response.status}`)
  }

  return response.json()
}

// 实验相关 API
export const experimentsAPI = {
  // 获取所有实验
  getAll: () => fetchAPI<any[]>("/api/experiments"),

  // 获取单个实验详情
  getById: (id: string) => fetchAPI<any>(`/api/experiments/${id}`),

  // 创建新实验
  create: async (data: any) => {
    const response = await fetchAPI<any>("/api/experiments", {
      method: "POST",
      body: JSON.stringify(data),
    })

    return response
  },

  // 为实验提供资金
  fund: async (id: string, amount: string) => {
    const response = await fetchAPI<any>(`/api/experiments/${id}/fund`, {
      method: "POST",
      body: JSON.stringify({ amount }),
    })

    return response
  },
  
  // 上传数据集
  uploadDataset: async (experimentId: string, data: FormData) => {
    // 注意：使用 FormData 需要移除默认的 Content-Type 头
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/experiments/${experimentId}/datasets`, {
      method: "POST",
      body: data,
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || `上传数据集失败: ${response.status}`);
    }
    
    return response.json();
  },
  
  // 获取数据集详情
  getDataset: (id: string) => fetchAPI<any>(`/api/experiments/datasets/${id}`),
  
  // 获取数据集内容
  getDatasetContent: (id: string) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    return `${apiUrl}/api/experiments/datasets/${id}/content`;
  },
  
  // 将数据集转换为NFT
  nftizeDataset: (id: string) => fetchAPI<any>(`/api/experiments/datasets/${id}/nft`, {
    method: "POST"
  }),
  
  // 引用数据集
  citeDataset: (citingDatasetId: string, citedDatasetId: string) => fetchAPI<any>(`/api/experiments/datasets/${citingDatasetId}/cite`, {
    method: "POST",
    body: JSON.stringify({ citedDatasetId })
  })
}

// 健康检查 API
export const healthAPI = {
  check: () => fetchAPI<any>("/health"),
}

"use client"

import { useState } from "react"
import { experimentsAPI } from "@/lib/api"
import { useWallet } from "./useWallet"

export function useDatasetManagement() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const { account } = useWallet()

  // 上传数据集
  const uploadDataset = async (
    experimentId: string, 
    title: string, 
    description: string, 
    file: File, 
    accessPrice: string, 
    isOpenAccess: boolean
  ) => {
    try {
      setIsLoading(true)
      setError(null)

      // 创建FormData对象
      const formData = new FormData()
      formData.append("title", title)
      formData.append("description", description)
      formData.append("accessPrice", accessPrice)
      formData.append("isOpenAccess", isOpenAccess.toString())
      formData.append("file", file)

      // 调用API上传数据集
      const result = await experimentsAPI.uploadDataset(experimentId, formData)
      return result
    } catch (err) {
      setError(err instanceof Error ? err : new Error("上传数据集失败"))
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  // 获取数据集详情
  const getDataset = async (datasetId: string) => {
    try {
      setIsLoading(true)
      setError(null)
      const dataset = await experimentsAPI.getDataset(datasetId)
      return dataset
    } catch (err) {
      setError(err instanceof Error ? err : new Error("获取数据集详情失败"))
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  // 获取数据集内容URL
  const getDatasetContentUrl = (datasetId: string) => {
    return experimentsAPI.getDatasetContent(datasetId)
  }

  // 将数据集转换为NFT
  const nftizeDataset = async (datasetId: string) => {
    try {
      setIsLoading(true)
      setError(null)
      const result = await experimentsAPI.nftizeDataset(datasetId)
      return result
    } catch (err) {
      setError(err instanceof Error ? err : new Error("NFT化数据集失败"))
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  // 引用数据集
  const citeDataset = async (citingDatasetId: string, citedDatasetId: string) => {
    try {
      setIsLoading(true)
      setError(null)
      const result = await experimentsAPI.citeDataset(citingDatasetId, citedDatasetId)
      return result
    } catch (err) {
      setError(err instanceof Error ? err : new Error("引用数据集失败"))
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    error,
    uploadDataset,
    getDataset,
    getDatasetContentUrl,
    nftizeDataset,
    citeDataset
  }
}

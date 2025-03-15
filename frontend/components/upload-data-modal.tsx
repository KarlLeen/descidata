"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FileUp, AlertCircle, CheckCircle, X } from "lucide-react"
import { useWeb3 } from "@/hooks/useWeb3"
import { useToast } from "@/components/ui/use-toast"
import type { MyProject } from "@/types/portfolio"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface UploadDataModalProps {
  isOpen: boolean
  onClose: () => void
  project: MyProject
  milestoneId: string
  onUploadSuccess: (milestoneId: string, uploadData: any) => void
}

export function UploadDataModal({ isOpen, onClose, project, milestoneId, onUploadSuccess }: UploadDataModalProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    files: null as File[] | null,
    dataType: "experimental_results",
    license: "CC-BY-4.0",
    milestoneId: milestoneId,
  })
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadedFiles, setUploadedFiles] = useState<{name: string, url: string, size: number}[]>([])
  const { contract, account } = useWeb3()
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, files: Array.from(e.target.files) })
    }
  }
  
  const handleDataTypeChange = (value: string) => {
    setFormData({ ...formData, dataType: value })
  }
  
  const handleLicenseChange = (value: string) => {
    setFormData({ ...formData, license: value })
  }
  
  const resetForm = useCallback(() => {
    setFormData({
      title: "",
      description: "",
      files: null,
      dataType: "experimental_results",
      license: "CC-BY-4.0",
      milestoneId: milestoneId,
    })
    setStep(1)
    setUploadProgress(0)
    setUploadedFiles([])
  }, [milestoneId])

  const handleSubmit = async () => {
    if (!contract || !account) {
      toast({
        title: "错误",
        description: "请先连接钱包",
        variant: "destructive",
      })
      return
    }
    
    if (!formData.files || formData.files.length === 0) {
      toast({
        title: "错误",
        description: "请选择至少一个文件上传",
        variant: "destructive",
      })
      return
    }
    
    try {
      setIsUploading(true)
      
      // 模拟上传进度
      const uploadInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 95) {
            clearInterval(uploadInterval)
            return 95
          }
          return prev + 5
        })
      }, 300)
      
      // 1. 上传文件到存储服务
      // 这里模拟上传过程，实际应用中应该使用 IPFS 或其他去中心化存储
      await new Promise((resolve) => setTimeout(resolve, 2000))
      
      // 生成模拟的文件URL
      const uploadedFileUrls = formData.files.map((file) => ({
        name: file.name,
        url: URL.createObjectURL(file), // 实际应用中这里应该是 IPFS 哈希或其他永久链接
        size: file.size
      }))
      
      setUploadedFiles(uploadedFileUrls)
      
      // 2. 创建数据 NFT 并更新智能合约
      // 在实际应用中，这里应该调用智能合约的方法来创建 NFT 并关联到里程碑
      const metadataJson = JSON.stringify({
        title: formData.title,
        description: formData.description,
        dataType: formData.dataType,
        license: formData.license,
        milestoneId: formData.milestoneId,
        files: uploadedFileUrls.map(f => ({ name: f.name, size: f.size })),
        timestamp: new Date().toISOString(),
      })
      
      // 模拟智能合约调用
      // 实际应用中应该使用类似以下代码：
      // const tx = await contract.uploadMilestoneData(formData.milestoneId, metadataIpfsHash)
      // await tx.wait()
      console.log("上传数据元数据:", metadataJson)
      
      // 完成上传
      clearInterval(uploadInterval)
      setUploadProgress(100)
      
      // 延迟一下，让用户看到 100% 的状态
      await new Promise((resolve) => setTimeout(resolve, 500))
      
      toast({
        title: "上传成功",
        description: `已成功上传 ${formData.files.length} 个文件`,
      })
      
      // 通知父组件上传成功
      // 创建上传数据对象
      const uploadData = {
        title: formData.title,
        description: formData.description,
        dataType: formData.dataType,
        license: formData.license,
        uploader: account,
        timestamp: Math.floor(Date.now() / 1000),
        uri: "ipfs://QmSimulated" + Math.random().toString(36).substring(2, 15),
        files: uploadedFileUrls
      }
      onUploadSuccess(formData.milestoneId, uploadData)
      
      // 关闭模态框并重置表单
      onClose()
      resetForm()
    } catch (error) {
      console.error("上传数据失败:", error)
      toast({
        title: "上传失败",
        description: "上传数据时发生错误，请查看控制台获取详细信息",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!isUploading && !open) {
        onClose()
        resetForm()
      }
    }}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>上传研究数据</DialogTitle>
          <DialogDescription>上传您的研究数据以创建数据 NFT 并解锁资金</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              此数据将被转换为 NFT 以确保其唯一性和所有权。上传将触发智能合约验证里程碑完成情况，并可能解锁相应的资金。
            </AlertDescription>
          </Alert>
          
          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>上传进度</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {step === 1 ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">数据标题</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="为此数据上传输入标题"
                  disabled={isUploading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">描述</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="描述此数据的内容和重要性"
                  disabled={isUploading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataType">数据类型</Label>
                <Select 
                  value={formData.dataType} 
                  onValueChange={handleDataTypeChange}
                  disabled={isUploading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择数据类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="experimental_results">实验结果</SelectItem>
                    <SelectItem value="raw_data">原始数据</SelectItem>
                    <SelectItem value="analysis">分析报告</SelectItem>
                    <SelectItem value="peer_review">同行评审</SelectItem>
                    <SelectItem value="milestone_evidence">里程碑证据</SelectItem>
                    <SelectItem value="other">其他</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="file">上传文件</Label>
                <div className="border-2 border-dashed rounded-lg p-4 text-center">
                  <Input 
                    id="file" 
                    type="file" 
                    multiple 
                    className="hidden" 
                    onChange={handleFileChange} 
                    disabled={isUploading}
                  />
                  <Label htmlFor="file" className={`${isUploading ? '' : 'cursor-pointer'}`}>
                    <FileUp className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">点击选择文件或拖放文件</p>
                  </Label>
                </div>
                {formData.files && (
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground mb-2">已选择 {formData.files.length} 个文件:</p>
                    <div className="max-h-32 overflow-y-auto space-y-1">
                      {Array.from(formData.files).map((file, index) => (
                        <div key={index} className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded">
                          <div className="flex items-center">
                            <FileUp className="h-4 w-4 mr-2 text-blue-500" />
                            <span className="truncate max-w-[200px]">{file.name}</span>
                          </div>
                          <span className="text-gray-500 text-xs">
                            {(file.size / 1024).toFixed(1)} KB
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="license">数据许可证</Label>
                <Select 
                  value={formData.license} 
                  onValueChange={handleLicenseChange}
                  disabled={isUploading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择许可证类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CC-BY-4.0">CC-BY-4.0 (署名)</SelectItem>
                    <SelectItem value="CC-BY-SA-4.0">CC-BY-SA-4.0 (署名-相同方式共享)</SelectItem>
                    <SelectItem value="CC-BY-NC-4.0">CC-BY-NC-4.0 (署名-非商业性使用)</SelectItem>
                    <SelectItem value="MIT">MIT 许可证</SelectItem>
                    <SelectItem value="GPL-3.0">GPL-3.0 许可证</SelectItem>
                    <SelectItem value="proprietary">专有许可证</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {uploadedFiles.length > 0 && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-100">
                  <div className="flex items-center text-green-700 mb-2">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    <h4 className="font-medium">上传成功</h4>
                  </div>
                  <p className="text-sm text-green-600 mb-2">以下文件已成功上传:</p>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between text-sm bg-white p-2 rounded">
                        <div className="flex items-center">
                          <FileUp className="h-4 w-4 mr-2 text-green-500" />
                          <span className="truncate max-w-[200px]">{file.name}</span>
                        </div>
                        <span className="text-gray-500 text-xs">
                          {(file.size / 1024).toFixed(1)} KB
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => step > 1 && setStep(step - 1)} 
            disabled={step === 1 || isUploading}
          >
            上一步
          </Button>
          <Button
            onClick={() => {
              if (step < 2) setStep(step + 1)
              else handleSubmit()
            }}
            disabled={isUploading || (step === 1 && !formData.title) || (step === 2 && (!formData.files || formData.files.length === 0))}
          >
            {isUploading ? "上传中..." : (step === 2 ? "上传并创建 NFT" : "下一步")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}


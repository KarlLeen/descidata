"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FileText, LinkIcon, Share2, Users, Loader2 } from "lucide-react"
import { PurchaseAccessModal } from "@/components/purchase-access-modal"
import { notFound } from "next/navigation"
import { useWallet } from "@/hooks/useWallet"
import { useExperimentData } from "@/hooks/useExperimentData"

export default function ExperimentPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("overview")
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false)
  const { isConnected, connectWallet } = useWallet()
  const { experiment, isLoading, error } = useExperimentData(params.id)

  if (isLoading) {
    return (
      <div className="container py-20 flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">加载实验数据中...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-20 text-center">
        <h2 className="text-2xl font-bold text-destructive mb-2">加载失败</h2>
        <p className="text-muted-foreground">{error.message}</p>
        <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
          重试
        </Button>
      </div>
    )
  }

  if (!experiment) {
    notFound()
  }

  const handleBuyClick = () => {
    if (!isConnected) {
      connectWallet()
    } else {
      setIsPurchaseModalOpen(true)
    }
  }

  const percentFunded = Math.round((experiment.fundingRaised / experiment.fundingGoal) * 100)

  return (
    <div className="container py-10">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-primary">
                {experiment.category}
              </Badge>
              <div className="text-sm text-muted-foreground">ID: {experiment.id}</div>
            </div>
            <h1 className="text-3xl font-bold">{experiment.title}</h1>
            <p className="text-muted-foreground">{experiment.description}</p>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={experiment.author?.avatar} alt={experiment.author?.name || '未知'} />
                  <AvatarFallback>{experiment.author?.name?.charAt(0) || '?'}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-sm font-medium">{experiment.author?.name || '未知'}</div>
                  <div className="text-xs text-muted-foreground">{experiment.author?.institution || '未知机构'}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Share2 className="mr-2 h-4 w-4" />
                  分享
                </Button>
                <Button variant="ghost" size="sm">
                  <LinkIcon className="mr-2 h-4 w-4" />
                  合约
                </Button>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">概览</TabsTrigger>
                <TabsTrigger value="updates">更新</TabsTrigger>
                <TabsTrigger value="data">数据</TabsTrigger>
                <TabsTrigger value="backers">支持者</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="mt-6 space-y-4">
                <div className="prose max-w-none dark:prose-invert">
                  <p>{experiment.details.overview}</p>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  {experiment.tags &&
                    experiment.tags.map((tag: string, index: number) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                </div>
              </TabsContent>
              <TabsContent value="updates" className="mt-6 space-y-4">
                {experiment.updates.map((update: any, index: number) => (
                  <Card key={index} className="mb-4">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">{update.title}</CardTitle>
                        <div className="text-sm text-muted-foreground">{update.date}</div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p>{update.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
              <TabsContent value="data" className="mt-6 space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">研究数据文件</h3>
                  <p className="text-sm text-muted-foreground">所有数据都存储在去中心化存储上，并有加密验证。</p>
                </div>
                {experiment.dataFiles.map((file: any, index: number) => (
                  <Card key={index} className="mb-4">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg flex items-center">
                          <FileText className="mr-2 h-4 w-4" />
                          {file.name}
                        </CardTitle>
                        <div className="text-sm text-muted-foreground">{file.date}</div>
                      </div>
                      <CardDescription>{file.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <div className="text-sm">大小: {file.size}</div>
                        <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                          IPFS Hash: {file.hash}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
              <TabsContent value="backers" className="mt-6 space-y-4">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-medium">{experiment.backers} 支持者</h3>
                </div>
                <div className="space-y-4 mt-4">
                  {experiment.supportTiers.map((tier: any, index: number) => (
                    <Card key={index}>
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg">{tier.title}</CardTitle>
                          <Badge variant="secondary">${tier.amount}</Badge>
                        </div>
                        <CardDescription>{tier.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm text-muted-foreground">{tier.backers} 支持者选择了此级别</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <div>
          <div className="sticky top-20">
            <Card>
              <CardHeader>
                <CardTitle>资金进度</CardTitle>
                <CardDescription>
                  {experiment.daysLeft > 0 ? `还剩 ${experiment.daysLeft} 天达到资金目标` : "资金期已结束"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>进度</span>
                    <span className="font-medium">{percentFunded}%</span>
                  </div>
                  <Progress value={percentFunded} className="h-2" />
                  <div className="flex items-center justify-between text-sm">
                    <span>${experiment.fundingRaised.toLocaleString()} 已筹</span>
                    <span>${experiment.fundingGoal.toLocaleString()} 目标</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <span className="font-medium">{experiment.backers}</span> 支持者
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">{experiment.daysLeft}</span> 天剩余
                  </div>
                </div>

                <div className="space-y-2">
                  <Button className="w-full" style={{ backgroundColor: "hsl(var(--orange))" }} onClick={handleBuyClick}>
                    支持此研究
                  </Button>
                  <Button variant="outline" className="w-full">
                    查看智能合约
                  </Button>
                </div>

                <div className="text-xs text-muted-foreground">
                  <p>合约地址: {experiment.contractAddress}</p>
                  <p className="mt-1">所有交易都由区块链技术保障。资金根据里程碑成就释放给研究人员。</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <PurchaseAccessModal
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
        experimentTitle={experiment.title}
        basePrice={experiment.accessPrice}
        experimentId={experiment.id}
      />
    </div>
  )
}


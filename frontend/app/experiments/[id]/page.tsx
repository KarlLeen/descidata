"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, LinkIcon, Share2, Timer, Wallet } from "lucide-react"
import { PurchaseAccessModal } from "@/components/purchase-access-modal"
import { notFound } from "next/navigation"
import { useWallet } from "@/hooks/useWallet"

// 这个函数用来获取实验数据
function getExperimentData(id: string) {
  // 在实际应用中，这里会从API或区块链获取数据
  const experimentData = {
    "qc-drug-discovery": {
      id: "qc-drug-discovery",
      title: "Quantum Computing for Drug Discovery",
      description: "Using quantum algorithms to accelerate drug discovery process",
      category: "Quantum Computing",
      accessPrice: 100, // Price in $EDU per month
      details: {
        overview: `This research project aims to leverage quantum computing algorithms to significantly accelerate the drug discovery process. We're developing novel quantum algorithms that can simulate molecular interactions with unprecedented accuracy.

Key Features:
• Quantum-accelerated molecular docking
• Novel drug candidate screening algorithms
• Integration with existing pharmaceutical databases
• Real-time molecular simulation capabilities`,
        methodology: `Our approach combines:
1. Quantum circuit design for molecular simulation
2. Machine learning optimization techniques
3. Classical-quantum hybrid algorithms
4. Cloud-based quantum computing resources`,
        impact: `Expected impacts include:
• 10x faster drug discovery pipeline
• More accurate molecular interaction predictions
• Reduced costs in pharmaceutical research
• Potential breakthroughs in treating complex diseases`,
      },
      requirements: {
        computation: "Access to quantum computing resources",
        data: "Molecular structure databases",
        timeline: "12 months",
      },
      benefits: [
        "Early access to research findings",
        "Rights to use data in derivative research",
        "Acknowledgment in publications",
        "Participation in research meetings",
      ],
      contractAddress: "0x1234567890abcdef",
      researchers: [
        {
          name: "Dr. Sarah Chen",
          role: "Principal Investigator",
          institution: "Quantum Research Institute",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        {
          name: "Dr. Michael Zhang",
          role: "Senior Researcher",
          institution: "Quantum Research Institute",
          avatar: "/placeholder.svg?height=40&width=40",
        },
      ],
    },
    // 可以添加更多实验数据...
  }

  return experimentData[id as keyof typeof experimentData]
}

export default function ExperimentDetails({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("overview")
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false)
  const { isConnected, connectWallet } = useWallet()

  const experiment = getExperimentData(params.id)

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

  return (
    <div className="container py-8">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <Badge variant="outline" className="mb-2">
              {experiment.category}
            </Badge>
            <h1 className="text-3xl font-bold mb-2">{experiment.title}</h1>
            <p className="text-muted-foreground">{experiment.description}</p>
          </div>

          <div className="flex flex-wrap gap-4">
            {experiment.researchers?.map((researcher, index) => (
              <Card key={index} className="flex items-center p-4 w-full md:w-auto">
                <img
                  src={researcher.avatar || "/placeholder.svg"}
                  alt={researcher.name}
                  className="w-10 h-10 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-medium">{researcher?.name || '未知'}</h4>
                  <p className="text-sm text-muted-foreground">{researcher?.role || '未知职位'}</p>
                  <p className="text-xs text-muted-foreground">{researcher?.institution || '未知机构'}</p>
                </div>
              </Card>
            ))}
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="methodology">Methodology</TabsTrigger>
              <TabsTrigger value="impact">Impact</TabsTrigger>
              <TabsTrigger value="requirements">Requirements</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="prose dark:prose-invert">
              <div className="mt-4 whitespace-pre-wrap">{experiment.details?.overview || '暂无概述信息'}</div>
            </TabsContent>
            <TabsContent value="methodology" className="prose dark:prose-invert">
              <div className="mt-4 whitespace-pre-wrap">{experiment.details?.methodology || '暂无方法信息'}</div>
            </TabsContent>
            <TabsContent value="impact" className="prose dark:prose-invert">
              <div className="mt-4 whitespace-pre-wrap">{experiment.details?.impact || '暂无影响信息'}</div>
            </TabsContent>
            <TabsContent value="requirements">
              <div className="mt-4 space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Computational Requirements</h3>
                  <p className="text-muted-foreground">{experiment.requirements?.computation || '暂无计算要求信息'}</p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Data Requirements</h3>
                  <p className="text-muted-foreground">{experiment.requirements?.data || '暂无数据要求信息'}</p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Timeline</h3>
                  <p className="text-muted-foreground">{experiment.requirements?.timeline || '暂无时间表信息'}</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Access Rights</CardTitle>
              <CardDescription>Purchase NFT access rights to this experiment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Timer className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Flexible Duration</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Wallet className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Transferable NFT</span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-medium">Base Price</span>
                  <span className="text-xl font-bold">{experiment.accessPrice || 0} $EDU</span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Per month of access. Purchase multiple months for longer access periods.
                </p>
                <Button className="w-full" size="lg" onClick={handleBuyClick}>
                  {isConnected ? "Buy Access NFT" : "Connect Wallet to Buy"}
                </Button>
              </div>

              <div className="pt-4 border-t space-y-2">
                <h4 className="font-medium">Access Benefits:</h4>
                <ul className="space-y-2">
                  {experiment.benefits?.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <div className="h-2 w-2 rounded-full bg-primary mt-1.5" />
                      <span>{benefit || ''}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t space-y-2">
                <h4 className="font-medium">NFT Features:</h4>
                <ul className="text-sm space-y-2">
                  <li className="flex items-start gap-2">
                    <FileText className="h-4 w-4 mt-1 text-primary" />
                    <span>Full experimental data and results</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <LinkIcon className="h-4 w-4 mt-1 text-primary" />
                    <span>Rights to use data in derivative research</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Share2 className="h-4 w-4 mt-1 text-primary" />
                    <span>Ability to transfer or trade access rights</span>
                  </li>
                </ul>
              </div>

              <div className="text-xs text-muted-foreground">Contract Address: {experiment.contractAddress}</div>
            </CardContent>
          </Card>
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


"use client"

import { useExperiments } from "@/hooks/useExperiments"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Filter, Search, SortDesc } from "lucide-react"
import AnimatedBackground from "@/components/animated-background"
import Link from "next/link"
import { useState } from "react"

export default function ExperimentsPage() {
  const { experiments, isLoading, error } = useExperiments()
  const [searchTerm, setSearchTerm] = useState("")

  // 过滤实验
  const filteredExperiments = experiments.filter(
    (exp) =>
      exp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // 按状态分组
  const activeExperiments = filteredExperiments.filter((exp) => exp.status === "active")
  const completedExperiments = filteredExperiments.filter((exp) => exp.status === "completed")

  if (isLoading) {
    return <div className="container py-20 text-center">加载中...</div>
  }

  if (error) {
    return <div className="container py-20 text-center text-red-500">加载失败: {error.message}</div>
  }

  return (
    <div className="relative">
      <AnimatedBackground />
      <div className="container py-10">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">实验计划</h1>
            <p className="text-muted-foreground">浏览和发现研究实验，或创建您自己的实验与科学界分享。</p>
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="搜索实验..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
                <span className="sr-only">筛选</span>
              </Button>
              <Button variant="outline" size="icon">
                <SortDesc className="h-4 w-4" />
                <span className="sr-only">排序</span>
              </Button>
            </div>
            <Button style={{ backgroundColor: "hsl(var(--orange))" }}>创建实验</Button>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList>
              <TabsTrigger value="all">所有实验</TabsTrigger>
              <TabsTrigger value="active">进行中</TabsTrigger>
              <TabsTrigger value="completed">已完成</TabsTrigger>
              <TabsTrigger value="my-contributions">我的贡献</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredExperiments.map((experiment) => (
                  <ExperimentCard key={experiment.id} experiment={experiment} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="active" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {activeExperiments.map((experiment) => (
                  <ExperimentCard key={experiment.id} experiment={experiment} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="completed" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {completedExperiments.map((experiment) => (
                  <ExperimentCard key={experiment.id} experiment={experiment} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="my-contributions" className="mt-6">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-muted-foreground">连接您的钱包以查看您的贡献</p>
                <Button variant="outline" className="mt-4">
                  连接钱包
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

function ExperimentCard({ experiment }: { experiment: any }) {
  const percentFunded = Math.round((experiment.fundingRaised / experiment.fundingGoal) * 100)

  return (
    <Card className="bg-card/80 backdrop-blur">
      <CardHeader>
        <div className="text-sm font-medium text-primary">{experiment.category}</div>
        <CardTitle className="line-clamp-1">{experiment.title}</CardTitle>
        <CardDescription className="line-clamp-2">{experiment.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>资金进度</span>
              <span className="font-medium">{percentFunded}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-secondary">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${percentFunded}%`,
                  backgroundColor: percentFunded >= 100 ? "hsl(var(--success))" : "hsl(var(--primary))",
                }}
              />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>${experiment.fundingRaised.toLocaleString()} 已筹</span>
              <span>${experiment.fundingGoal.toLocaleString()} 目标</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            {experiment.status === "active" ? (
              <div className="text-sm text-muted-foreground">
                <span className="font-medium">{experiment.daysLeft}</span> 天剩余
              </div>
            ) : (
              <div className="text-sm text-success font-medium">已完成</div>
            )}
            <div className="text-sm text-muted-foreground">作者: {experiment.author?.name || '未知'}</div>
          </div>
          <div className="text-xs text-muted-foreground truncate">合约: {experiment.contractAddress}</div>
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/experiments/${experiment.id}`} className="w-full">
          <Button className="w-full">查看详情</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}


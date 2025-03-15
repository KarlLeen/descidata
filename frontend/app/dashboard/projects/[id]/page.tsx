"use client"

import { useState, useEffect, useCallback } from 'react'
import { useParams, notFound } from 'next/navigation'
import { useWeb3 } from '@/hooks/useWeb3'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  CalendarDaysIcon, 
  ChartBarIcon, 
  ClipboardDocumentListIcon,
  PencilIcon,
  ArrowLeftIcon,
  DocumentIcon,
  ArrowUpTrayIcon,
  DocumentTextIcon,
  ClockIcon,
  UserIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { UploadDataModal } from '@/components/upload-data-modal'

// 定义从智能合约加载的里程碑数据接口
interface MilestoneData {
  exists: boolean;
  id: string;
  name: string;
  targetProgress: number;
  currentProgress: number;
  kpis: {
    metric: string;
    target: number;
    current: number;
  }[];
}

// 扩展KPI接口以包含当前值
interface LoadedKPI {
  metric: string;
  target: number;
  current: number;
}

// 扩展里程碑接口以包含进度和KPI
interface LoadedMilestone {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  progress: number;
  kpis: LoadedKPI[];
}

// 扩展阶段接口以包含进度和里程碑
interface LoadedPhase {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  progress: number;
  milestones: LoadedMilestone[];
}

// 定义数据上传接口
interface DataUpload {
  title: string;
  description?: string;
  dataType: string;
  license: string;
  uploader: string;
  timestamp: number;
  uri: string;
  files: {
    name: string;
    size: number;
    type: string;
    url: string;
  }[];
}

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.id as string;
  const [phases, setPhases] = useState<LoadedPhase[]>([]);
  const [selectedMilestone, setSelectedMilestone] = useState<LoadedMilestone | null>(null);
  const [isEditingProgress, setIsEditingProgress] = useState(false);
  const [newProgress, setNewProgress] = useState(0);
  const [isEditingKPI, setIsEditingKPI] = useState<number | null>(null);
  const [newKPIValue, setNewKPIValue] = useState(0);
  const { contract, account, isProjectManager, uploadMilestoneData, getMilestoneData } = useWeb3();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [projectData, setProjectData] = useState<any>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [dataUploads, setDataUploads] = useState<Record<string, DataUpload[]>>({});
  const [loadingData, setLoadingData] = useState(false);

  // 加载所有阶段和里程碑的数据
  const loadProjectData = useCallback(async () => {
    if (!contract) {
      setError('请先连接钱包');
      setPhases([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // 尝试从合约加载项目数据
      try {
        // 假设有一个方法可以获取项目详情
        const projectDetails = await contract.getExperimentById(projectId).catch(() => null);
        if (projectDetails) {
          setProjectData(projectDetails);
        }
      } catch (error) {
        console.error('加载项目详情失败:', error);
      }

      const loadedPhases = await Promise.all(
        initialPhases.map(async (phase) => {
          // 获取阶段进度
          const phaseProgress = await contract.getPhaseProgress(phase.id).catch(() => 0);
          
          // 获取阶段内所有里程碑的数据
          const loadedMilestones = await Promise.all(
            phase.milestones.map(async (milestone) => {
              try {
                const milestoneData: MilestoneData = await contract.getMilestone(milestone.id);
                if (!milestoneData.exists) {
                  // 如果里程碑不存在，返回初始数据
                  return {
                    ...milestone,
                    progress: 0,
                    kpis: milestone.kpis.map(kpi => ({ ...kpi, current: 0 }))
                  };
                }
                
                // 如果里程碑存在，返回合约中的数据
                return {
                  ...milestone,
                  progress: Number(milestoneData.currentProgress),
                  kpis: milestoneData.kpis.map((kpi: any) => ({
                    metric: kpi.metric,
                    target: Number(kpi.target),
                    current: Number(kpi.current)
                  }))
                };
              } catch (error) {
                console.error(`获取里程碑 ${milestone.id} 数据失败:`, error);
                // 发生错误时返回初始数据
                return {
                  ...milestone,
                  progress: 0,
                  kpis: milestone.kpis.map(kpi => ({ ...kpi, current: 0 }))
                };
              }
            })
          );

          // 返回包含里程碑数据的阶段
          return {
            ...phase,
            progress: Number(phaseProgress),
            milestones: loadedMilestones
          };
        })
      );

      setPhases(loadedPhases);
      setIsLoading(false);
    } catch (error) {
      console.error('加载项目数据失败:', error);
      setError('加载项目数据失败，请检查控制台获取详细信息');
      setIsLoading(false);
    }
  }, [contract, projectId]);

  // 当合约或账户变化时加载数据
  useEffect(() => {
    if (contract && account) {
      loadProjectData();
      loadMilestoneData();
    }
  }, [contract, account, loadProjectData]);
  
  // 加载里程碑数据
  const loadMilestoneData = async () => {
    if (!contract || !getMilestoneData) return;
    
    setLoadingData(true);
    try {
      const uploads: Record<string, DataUpload[]> = {};
      
      // 遍历所有阶段和里程碑
      for (const phase of initialPhases) {
        for (const milestone of phase.milestones) {
          // 获取该里程碑的数据上传
          const milestoneData = await getMilestoneData(milestone.id);
          
          // 将合约数据转换为前端需要的格式
          if (milestoneData && milestoneData.length > 0) {
            const formattedData: DataUpload[] = milestoneData.map(data => {
              // 解析dataURI中的JSON数据
              let parsedData = {
                description: '',
                dataType: 'dataset',
                license: 'CC-BY-4.0',
                files: []
              };
              
              try {
                parsedData = JSON.parse(data.dataURI);
              } catch (e) {
                console.error('解析数据URI失败:', e);
              }
              
              return {
                title: data.title,
                description: parsedData.description,
                dataType: parsedData.dataType,
                license: parsedData.license,
                uploader: data.uploader,
                timestamp: data.timestamp,
                uri: data.dataURI,
                files: parsedData.files || []
              };
            });
            
            uploads[milestone.id] = formattedData;
          }
        }
      }
      
      // 添加测试数据
      const testData = getTestData();
      setDataUploads({...uploads, ...testData});
    } catch (error) {
      console.error('加载里程碑数据失败:', error);
    } finally {
      setLoadingData(false);
    }
  };
  
  // 生成测试数据
  const getTestData = (): Record<string, DataUpload[]> => {
    const now = Date.now() / 1000;
    return {
      'ms1.1': [
        {
          title: '用户认证系统测试数据',
          description: '包含用户认证流程的测试结果和性能指标',
          dataType: 'dataset',
          license: 'CC-BY-4.0',
          uploader: '0x1234...5678',
          timestamp: now - 86400 * 5, // 5天前
          uri: 'ipfs://QmTest1',
          files: [
            {
              name: 'auth_test_results.csv',
              size: 1024 * 1024 * 2.5,
              type: 'text/csv',
              url: '#'
            },
            {
              name: 'performance_metrics.json',
              size: 1024 * 512,
              type: 'application/json',
              url: '#'
            }
          ]
        }
      ],
      'ms1.2': [
        {
          title: '数据管理系统架构',
          description: '包含系统架构图和API文档',
          dataType: 'documentation',
          license: 'MIT',
          uploader: '0x9876...5432',
          timestamp: now - 86400 * 3, // 3天前
          uri: 'ipfs://QmTest2',
          files: [
            {
              name: 'architecture.pdf',
              size: 1024 * 1024 * 5,
              type: 'application/pdf',
              url: '#'
            }
          ]
        },
        {
          title: '元数据字段验证测试',
          description: '验证元数据字段完整性和准确性的测试结果',
          dataType: 'test_results',
          license: 'CC-BY-4.0',
          uploader: '0x9876...5432',
          timestamp: now - 86400 * 2, // 2天前
          uri: 'ipfs://QmTest3',
          files: [
            {
              name: 'metadata_validation.xlsx',
              size: 1024 * 1024 * 1.2,
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              url: '#'
            }
          ]
        }
      ],
      'ms2.1': [
        {
          title: 'NFT铸造测试报告',
          description: '不同网络上NFT铸造成功率和gas费用分析',
          dataType: 'report',
          license: 'CC-BY-SA-4.0',
          uploader: '0x5678...1234',
          timestamp: now - 86400 * 1, // 1天前
          uri: 'ipfs://QmTest4',
          files: [
            {
              name: 'nft_minting_report.pdf',
              size: 1024 * 1024 * 3.7,
              type: 'application/pdf',
              url: '#'
            },
            {
              name: 'gas_analysis.csv',
              size: 1024 * 768,
              type: 'text/csv',
              url: '#'
            }
          ]
        }
      ],
      'ms3.2': [
        {
          title: '数据验证算法源代码',
          description: '用于验证研究数据完整性的算法源代码',
          dataType: 'code',
          license: 'MIT',
          uploader: '0x2468...1357',
          timestamp: now - 86400 * 0.5, // 12小时前
          uri: 'ipfs://QmTest5',
          files: [
            {
              name: 'validation_algorithms.zip',
              size: 1024 * 1024 * 8.2,
              type: 'application/zip',
              url: '#'
            },
            {
              name: 'README.md',
              size: 1024 * 15,
              type: 'text/markdown',
              url: '#'
            }
          ]
        },
        {
          title: '同行评审结果数据集',
          description: '包含50份同行评审的匿名结果和统计分析',
          dataType: 'peer_review',
          license: 'CC-BY-NC-4.0',
          uploader: '0x2468...1357',
          timestamp: now - 86400 * 0.2, // 4.8小时前
          uri: 'ipfs://QmTest6',
          files: [
            {
              name: 'peer_reviews.json',
              size: 1024 * 1024 * 1.8,
              type: 'application/json',
              url: '#'
            },
            {
              name: 'statistical_analysis.xlsx',
              size: 1024 * 1024 * 2.3,
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              url: '#'
            }
          ]
        }
      ]
    };
  };

  // 更新里程碑进度
  const handleMilestoneUpdate = useCallback(async (milestoneId: string, progress: number) => {
    if (!contract || !account) {
      setError('请先连接钱包');
      return;
    }
    
    if (!isProjectManager) {
      setError('只有项目经理可以更新进度');
      return;
    }

    try {
      setIsLoading(true);
      const tx = await contract.updateMilestoneProgress(milestoneId, progress);
      await tx.wait();
      await loadProjectData();
      setIsEditingProgress(false);
    } catch (error) {
      console.error('更新进度失败:', error);
      setError('更新进度失败，请检查控制台获取详细信息');
    } finally {
      setIsLoading(false);
    }
  }, [contract, account, isProjectManager, loadProjectData]);

  // 更新KPI值
  const handleKPIUpdate = useCallback(async (milestoneId: string, kpiIndex: number, current: number) => {
    if (!contract) {
      setError('请先连接钱包');
      return;
    }
    
    if (!isProjectManager) {
      setError('只有项目经理可以更新KPI');
      return;
    }

    try {
      setIsLoading(true);
      const tx = await contract.updateMilestoneKPI(milestoneId, kpiIndex, current);
      await tx.wait();
      await loadProjectData();
      setIsEditingKPI(null);
    } catch (error) {
      console.error('更新KPI失败:', error);
      setError('更新KPI失败，请检查控制台获取详细信息');
    } finally {
      setIsLoading(false);
    }
  }, [contract, isProjectManager, loadProjectData]);
  
  // 处理数据上传成功
  const handleUploadSuccess = useCallback(async (milestoneId: string, dataUpload: DataUpload) => {
    // 更新本地状态
    setDataUploads(prev => ({
      ...prev,
      [milestoneId]: [...(prev[milestoneId] || []), dataUpload]
    }));
    
    // 关闭模态框
    setIsUploadModalOpen(false);
    
    // 重新加载里程碑数据
    await loadMilestoneData();
  }, [loadMilestoneData]);

  // 计算阶段进度
  const calculatePhaseProgress = useCallback((phase: LoadedPhase): number => {
    if (!phase.milestones.length) return 0;
    return Math.round(
      phase.milestones.reduce((sum, milestone) => sum + milestone.progress, 0) / phase.milestones.length
    );
  }, []);

  // 计算总体进度
  const calculateOverallProgress = useCallback((): number => {
    if (!phases.length) return 0;
    return Math.round(
      phases.reduce((sum, phase) => sum + calculatePhaseProgress(phase), 0) / phases.length
    );
  }, [phases, calculatePhaseProgress]);

  // 初始阶段数据 - 这里使用的是示例数据，实际应用中会从合约加载
  const initialPhases: LoadedPhase[] = [
    {
      id: 'phase1',
      name: '基础设施与核心功能',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-02-15'),
      progress: 0,
      milestones: [
        {
          id: 'ms1.1',
          name: '用户系统与认证',
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-01-14'),
          progress: 0,
          kpis: [
            { metric: '钱包连接数', target: 3, current: 0 },
            { metric: '认证成功率', target: 95, current: 0 }
          ]
        },
        {
          id: 'ms1.2',
          name: '数据管理',
          startDate: new Date('2024-01-15'),
          endDate: new Date('2024-01-31'),
          progress: 0,
          kpis: [
            { metric: '上传成功率', target: 99, current: 0 },
            { metric: '元数据字段数', target: 10, current: 0 }
          ]
        },
        {
          id: 'ms1.3',
          name: '智能合约',
          startDate: new Date('2024-02-01'),
          endDate: new Date('2024-02-15'),
          progress: 0,
          kpis: [
            { metric: '测试覆盖率', target: 90, current: 0 },
            { metric: '气体优化率', target: 30, current: 0 }
          ]
        }
      ]
    },
    {
      id: 'phase2',
      name: '功能扩展',
      startDate: new Date('2024-02-16'),
      endDate: new Date('2024-04-15'),
      progress: 0,
      milestones: [
        {
          id: 'ms2.1',
          name: 'NFT功能',
          startDate: new Date('2024-02-16'),
          endDate: new Date('2024-03-07'),
          progress: 0,
          kpis: [
            { metric: '铸造成功率', target: 100, current: 0 },
            { metric: '定价模型数', target: 3, current: 0 }
          ]
        },
        {
          id: 'ms2.2',
          name: '引用系统',
          startDate: new Date('2024-03-08'),
          endDate: new Date('2024-03-31'),
          progress: 0,
          kpis: [
            { metric: '追踪准确率', target: 100, current: 0 },
            { metric: '验证时间', target: 1, current: 0 }
          ]
        },
        {
          id: 'ms2.3',
          name: 'UI/UX',
          startDate: new Date('2024-04-01'),
          endDate: new Date('2024-04-15'),
          progress: 0,
          kpis: [
            { metric: '加载时间', target: 2, current: 0 },
            { metric: 'UX评分', target: 90, current: 0 }
          ]
        }
      ]
    },
    {
      id: 'phase3',
      name: '生态系统与可扩展性',
      startDate: new Date('2024-04-16'),
      endDate: new Date('2024-05-31'),
      progress: 0,
      milestones: [
        {
          id: 'ms3.1',
          name: '众筹',
          startDate: new Date('2024-04-16'),
          endDate: new Date('2024-04-30'),
          progress: 0,
          kpis: [
            { metric: '资金成功率', target: 95, current: 0 },
            { metric: '评估分数', target: 90, current: 0 }
          ]
        },
        {
          id: 'ms3.2',
          name: '数据验证',
          startDate: new Date('2024-05-01'),
          endDate: new Date('2024-05-15'),
          progress: 0,
          kpis: [
            { metric: '准确率', target: 95, current: 0 },
            { metric: '同行评审完成率', target: 90, current: 0 }
          ]
        },
        {
          id: 'ms3.3',
          name: 'API与集成',
          startDate: new Date('2024-05-16'),
          endDate: new Date('2024-05-31'),
          progress: 0,
          kpis: [
            { metric: '响应时间', target: 100, current: 0 },
            { metric: 'SDK成功率', target: 95, current: 0 }
          ]
        }
      ]
    }
  ];

  if (isLoading && phases.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <p className="text-lg font-semibold">加载中...</p>
        </div>
      </div>
    );
  }

  if (error && phases.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-lg">
          <p>{error}</p>
          <Button 
            onClick={() => loadProjectData()} 
            className="mt-4"
          >
            重试
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <p className="text-lg font-semibold">加载中...</p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
            <p>{error}</p>
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center mb-6">
            <Link href="/dashboard/progress" className="mr-4">
              <Button variant="outline" size="icon">
                <ArrowLeftIcon className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">项目详情</h1>
              <p className="text-gray-500">项目 ID: {projectId}</p>
            </div>
          </div>

          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">总体进度</p>
                <p className="text-2xl font-bold">{calculateOverallProgress()}%</p>
              </div>
              <div className="h-16 w-16 rounded-full border-4 border-blue-500 flex items-center justify-center">
                <span className="text-xl font-bold text-blue-500">
                  {calculateOverallProgress()}%
                </span>
              </div>
            </div>
            {isProjectManager && (
              <div>
                <Button 
                  onClick={() => {
                    if (selectedMilestone) {
                      setIsEditingProgress(true);
                      setNewProgress(selectedMilestone.progress);
                    }
                  }}
                  disabled={!selectedMilestone}
                >
                  更新进度
                </Button>
              </div>
            )}
          </div>

          <Tabs defaultValue="milestones">
            <TabsList className="flex space-x-4 border-b border-gray-200 mb-6">
              <TabsTrigger value="milestones" className="flex items-center space-x-2 px-4 py-2 font-medium text-sm rounded-t-lg">
                <ChartBarIcon className="h-5 w-5" />
                <span>里程碑</span>
              </TabsTrigger>
              <TabsTrigger value="kpis" className="flex items-center space-x-2 px-4 py-2 font-medium text-sm rounded-t-lg">
                <ClipboardDocumentListIcon className="h-5 w-5" />
                <span>KPI指标</span>
              </TabsTrigger>
              <TabsTrigger value="data" className="flex items-center space-x-2 px-4 py-2 font-medium text-sm rounded-t-lg">
                <DocumentIcon className="h-5 w-5" />
                <span>研究数据</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="milestones">
              <div className="grid grid-cols-1 gap-8">
                {phases.map((phase) => (
                  <div key={phase.id} className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-semibold">{phase.name}</h2>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">阶段进度</span>
                        <span className="font-semibold">
                          {calculatePhaseProgress(phase)}%
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {phase.milestones.map((milestone) => (
                        <Card 
                          key={milestone.id} 
                          className={`cursor-pointer ${selectedMilestone?.id === milestone.id ? 'ring-2 ring-blue-500' : ''}`}
                          onClick={() => setSelectedMilestone(milestone)}
                        >
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg">{milestone.name}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span>进度</span>
                                  <span className="font-medium">{milestone.progress}%</span>
                                </div>
                                <Progress value={milestone.progress} className="h-2" />
                              </div>
                              <div className="text-sm text-gray-500">
                                <div className="flex justify-between">
                                  <span>开始日期</span>
                                  <span>{milestone.startDate.toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>结束日期</span>
                                  <span>{milestone.endDate.toLocaleDateString()}</span>
                                </div>
                              </div>
                              <div className="pt-2 border-t">
                                <p className="text-sm font-medium mb-1">KPI指标:</p>
                                <ul className="space-y-1">
                                  {milestone.kpis.map((kpi, index) => (
                                    <li key={index} className="text-sm flex justify-between">
                                      <span>{kpi.metric}:</span>
                                      <span className="font-medium">{kpi.current}/{kpi.target}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {selectedMilestone && isEditingProgress && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                    <h3 className="text-xl font-semibold mb-4">更新里程碑进度</h3>
                    <p className="mb-2">{selectedMilestone.name}</p>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">进度 (0-100%)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={newProgress}
                        onChange={(e) => setNewProgress(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsEditingProgress(false)}>取消</Button>
                      <Button onClick={() => handleMilestoneUpdate(selectedMilestone.id, newProgress)}>保存</Button>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="kpis">
              <div className="space-y-8">
                {phases.map((phase) => (
                  <div key={phase.id}>
                    <h2 className="text-xl font-semibold mb-4">{phase.name}</h2>
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              里程碑
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              KPI指标
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              目标值
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              当前值
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              完成度
                            </th>
                            {isProjectManager && (
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                操作
                              </th>
                            )}
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {phase.milestones.map((milestone) =>
                            milestone.kpis.map((kpi, kpiIndex) => (
                              <tr key={`${milestone.id}-${kpiIndex}`}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {milestone.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {kpi.metric}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {kpi.target}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {isEditingKPI === kpiIndex && selectedMilestone?.id === milestone.id ? (
                                    <input
                                      type="number"
                                      min="0"
                                      max={kpi.target}
                                      value={newKPIValue}
                                      onChange={(e) => setNewKPIValue(Math.min(kpi.target, Math.max(0, parseInt(e.target.value) || 0)))}
                                      className="w-20 p-1 border rounded-md"
                                    />
                                  ) : (
                                    kpi.current
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div
                                      className="bg-blue-600 h-2.5 rounded-full"
                                      style={{
                                        width: `${(kpi.current / kpi.target) * 100}%`,
                                      }}
                                    />
                                  </div>
                                </td>
                                {isProjectManager && (
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {isEditingKPI === kpiIndex && selectedMilestone?.id === milestone.id ? (
                                      <div className="flex space-x-2">
                                        <Button 
                                          size="sm" 
                                          variant="outline" 
                                          onClick={() => setIsEditingKPI(null)}
                                        >
                                          取消
                                        </Button>
                                        <Button 
                                          size="sm" 
                                          onClick={() => handleKPIUpdate(milestone.id, kpiIndex, newKPIValue)}
                                        >
                                          保存
                                        </Button>
                                      </div>
                                    ) : (
                                      <Button 
                                        size="sm" 
                                        variant="outline" 
                                        onClick={() => {
                                          setSelectedMilestone(milestone);
                                          setIsEditingKPI(kpiIndex);
                                          setNewKPIValue(kpi.current);
                                        }}
                                      >
                                        <PencilIcon className="h-4 w-4" />
                                      </Button>
                                    )}
                                  </td>
                                )}
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="data">
              <div className="space-y-8">
                {phases.map((phase) => (
                  <div key={phase.id} className="space-y-4">
                    <h2 className="text-xl font-semibold">{phase.name}</h2>
                    
                    {phase.milestones.map((milestone) => {
                      const milestoneUploads = dataUploads[milestone.id] || [];
                      return (
                        <div key={milestone.id} className="bg-white rounded-lg shadow-md p-4">
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium">{milestone.name}</h3>
                            {isProjectManager && (
                              <Button 
                                onClick={() => {
                                  setSelectedMilestone(milestone);
                                  setIsUploadModalOpen(true);
                                }}
                                className="flex items-center space-x-1"
                              >
                                <ArrowUpTrayIcon className="h-4 w-4 mr-1" />
                                <span>上传数据</span>
                              </Button>
                            )}
                          </div>
                          
                          {milestoneUploads.length > 0 ? (
                            <div className="space-y-3">
                              {milestoneUploads.map((upload, index) => {
                                // 解析时间戳为日期
                                const uploadDate = new Date(upload.timestamp * 1000);
                                return (
                                  <div key={index} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <h4 className="font-medium flex items-center">
                                          <DocumentTextIcon className="h-5 w-5 mr-2 text-blue-500" />
                                          {upload.title}
                                        </h4>
                                        {upload.description && (
                                          <p className="text-sm text-gray-600 mt-1">{upload.description}</p>
                                        )}
                                      </div>
                                      <div className="text-xs text-gray-500 flex flex-col items-end">
                                        <div className="flex items-center mb-1">
                                          <ClockIcon className="h-3 w-3 mr-1" />
                                          <span>{uploadDate.toLocaleDateString()} {uploadDate.toLocaleTimeString()}</span>
                                        </div>
                                        <div className="flex items-center">
                                          <UserIcon className="h-3 w-3 mr-1" />
                                          <span className="truncate max-w-[120px]">{upload.uploader}</span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                      {upload.dataType && (
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                          {upload.dataType.replace('_', ' ')}
                                        </span>
                                      )}
                                      {upload.license && (
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                          {upload.license}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="text-center py-8 text-gray-500">
                              <DocumentIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                              <p>该里程碑暂无数据上传</p>
                              {isProjectManager && (
                                <Button 
                                  variant="outline" 
                                  className="mt-3"
                                  onClick={() => {
                                    setSelectedMilestone(milestone);
                                    setIsUploadModalOpen(true);
                                  }}
                                >
                                  上传第一个数据
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
                
                {loadingData && (
                  <div className="text-center py-8">
                    <p>加载数据中...</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
          
          {/* 数据上传模态框 */}
          {selectedMilestone && (
            <UploadDataModal 
              isOpen={isUploadModalOpen} 
              onClose={() => setIsUploadModalOpen(false)} 
              project={{
                id: projectId,
                title: "研究项目",
                fundingGoal: 0,
                fundingRaised: 0,
                status: "in_progress",
                nextMilestone: {
                  title: selectedMilestone.name,
                  deadline: selectedMilestone.endDate.toISOString(),
                  fundingLocked: 0
                },
                progress: calculateOverallProgress(),
                dataUploads: []
              }}
              milestoneId={selectedMilestone.id}
              onUploadSuccess={handleUploadSuccess}
            />
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState, useCallback } from 'react';
import GanttChart from '@/components/GanttChart';
import ProgressCard from '@/components/GanttChart/ProgressCard';
import { Phase, Milestone } from '@/components/GanttChart/types';
import { useWeb3 } from '@/hooks/useWeb3';
import { Tab } from '@headlessui/react';
import { CalendarDaysIcon, ChartBarIcon, ClipboardDocumentListIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

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

// 定义 KPI 接口以包含当前值
interface KPI {
  metric: string;
  target: number;
  current: number;
}

// 使用 KPI 接口
type LoadedKPI = KPI;

// 扩展里程碑接口以包含进度和KPI
interface LoadedMilestone extends Milestone {
  progress: number;
  kpis: LoadedKPI[];
}

// 扩展阶段接口以包含进度和里程碑
interface LoadedPhase extends Phase {
  progress: number;
  milestones: LoadedMilestone[];
}

// 初始阶段数据
const initialPhases: Phase[] = [
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

export default function ProgressPage() {
  // 状态管理
  const [phases, setPhases] = useState<LoadedPhase[]>([]);
  const { contract, account, isProjectManager } = useWeb3();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
  }, [contract]);

  // 当合约或账户变化时加载数据
  useEffect(() => {
    if (contract && account) {
      loadProjectData();
    }
  }, [contract, account, loadProjectData]);

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
    } catch (error) {
      console.error('更新KPI失败:', error);
      setError('更新KPI失败，请检查控制台获取详细信息');
    } finally {
      setIsLoading(false);
    }
  }, [contract, isProjectManager, loadProjectData]);

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
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">项目进度追踪</h1>
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
          </div>

          <Tab.Group>
            <Tab.List className="flex space-x-4 border-b border-gray-200 mb-6">
              <Tab className={({ selected }: { selected: boolean }) =>
                `flex items-center space-x-2 px-4 py-2 font-medium text-sm rounded-t-lg 
                ${selected 
                  ? 'text-blue-600 bg-blue-50 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`
              }>
                <CalendarDaysIcon className="h-5 w-5" />
                <span>甘特图</span>
              </Tab>
              <Tab className={({ selected }: { selected: boolean }) =>
                `flex items-center space-x-2 px-4 py-2 font-medium text-sm rounded-t-lg 
                ${selected 
                  ? 'text-blue-600 bg-blue-50 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`
              }>
                <ChartBarIcon className="h-5 w-5" />
                <span>里程碑</span>
              </Tab>
              <Tab className={({ selected }: { selected: boolean }) =>
                `flex items-center space-x-2 px-4 py-2 font-medium text-sm rounded-t-lg 
                ${selected 
                  ? 'text-blue-600 bg-blue-50 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`
              }>
                <ClipboardDocumentListIcon className="h-5 w-5" />
                <span>KPI指标</span>
              </Tab>
            </Tab.List>

            <Tab.Panels>
              <Tab.Panel>
                <GanttChart
                  phases={phases}
                  onMilestoneUpdate={handleMilestoneUpdate}
                  onKPIUpdate={handleKPIUpdate}
                />
              </Tab.Panel>

              <Tab.Panel>
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
                          <div key={milestone.id} className="relative">
                            <ProgressCard
                              milestone={milestone}
                              onProgressUpdate={(progress) => 
                                handleMilestoneUpdate(milestone.id, progress)
                              }
                              onKPIUpdate={(kpiIndex, value) =>
                                handleKPIUpdate(milestone.id, kpiIndex, value)
                              }
                            />
                            <div className="absolute top-2 right-2">
                              <Link 
                                href={`/dashboard/projects/${milestone.id}`}
                                className="inline-flex items-center justify-center rounded-full bg-blue-50 p-1 text-blue-600 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                title="查看详情"
                              >
                                <ArrowRightIcon className="h-5 w-5" />
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Tab.Panel>

              <Tab.Panel>
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
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {phase.milestones.map((milestone) =>
                              milestone.kpis.map((kpi, kpiIndex) => (
                                <tr key={`${milestone.id}-${kpiIndex}`}>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    <div className="flex items-center">
                                      <span className="mr-2">{milestone.name}</span>
                                      <Link 
                                        href={`/dashboard/projects/${milestone.id}`}
                                        className="text-blue-600 hover:text-blue-900"
                                        title="查看详情"
                                      >
                                        <ArrowRightIcon className="h-4 w-4" />
                                      </Link>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {kpi.metric}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {kpi.target}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <button
                                      onClick={() => {
                                        const newValue = prompt(
                                          `更新 ${kpi.metric} (0-${kpi.target}):`,
                                          kpi.current.toString()
                                        );
                                        if (newValue !== null) {
                                          const value = Math.min(
                                            kpi.target,
                                            Math.max(0, parseFloat(newValue))
                                          );
                                          if (!isNaN(value)) {
                                            handleKPIUpdate(milestone.id, kpiIndex, value);
                                          }
                                        }
                                      }}
                                      className="text-blue-600 hover:text-blue-900"
                                    >
                                      {kpi.current}
                                    </button>
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
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    </div>
  );
}

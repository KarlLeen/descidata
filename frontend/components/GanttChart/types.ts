export interface KPI {
  metric: string;
  target: number;
  current: number;
}

export interface Milestone {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  progress: number;
  dependencies?: string[];
  kpis: KPI[];
}

export interface Phase {
  id: string;
  name: string;
  milestones: Milestone[];
  startDate: Date;
  endDate: Date;
  progress: number;
}

export interface GanttChartProps {
  phases: Phase[];
  onMilestoneUpdate?: (milestoneId: string, progress: number) => void;
  onKPIUpdate?: (milestoneId: string, kpiIndex: number, current: number) => void;
}

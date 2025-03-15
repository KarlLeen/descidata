import React from 'react';
import { Milestone } from './types';

interface ProgressCardProps {
  milestone: Milestone;
  onProgressUpdate: (progress: number) => void;
  onKPIUpdate: (kpiIndex: number, value: number) => void;
}

const ProgressCard: React.FC<ProgressCardProps> = ({
  milestone,
  onProgressUpdate,
  onKPIUpdate,
}) => {
  const getStatusColor = (progress: number) => {
    if (progress >= 100) return 'bg-green-100 border-green-500 text-green-700';
    if (progress >= 50) return 'bg-blue-100 border-blue-500 text-blue-700';
    if (progress >= 25) return 'bg-yellow-100 border-yellow-500 text-yellow-700';
    return 'bg-gray-100 border-gray-500 text-gray-700';
  };

  return (
    <div className={`rounded-lg border-l-4 p-4 ${getStatusColor(milestone.progress)}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-lg">{milestone.name}</h3>
          <p className="text-sm opacity-75">
            {milestone.startDate.toLocaleDateString()} - {milestone.endDate.toLocaleDateString()}
          </p>
        </div>
        <div className="text-right">
          <div className="font-bold text-2xl">{milestone.progress}%</div>
          <button
            onClick={() => {
              const newProgress = prompt('更新进度 (0-100):', milestone.progress.toString());
              if (newProgress !== null) {
                const progress = Math.min(100, Math.max(0, parseInt(newProgress, 10)));
                if (!isNaN(progress)) onProgressUpdate(progress);
              }
            }}
            className="text-sm underline hover:opacity-75"
          >
            更新进度
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {milestone.kpis.map((kpi, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{kpi.metric}</span>
              <span className="text-sm">
                {kpi.current}/{kpi.target}
              </span>
            </div>
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <button
                    onClick={() => {
                      const newValue = prompt(
                        `更新 ${kpi.metric} (0-${kpi.target}):`,
                        kpi.current.toString()
                      );
                      if (newValue !== null) {
                        const value = Math.min(kpi.target, Math.max(0, parseFloat(newValue)));
                        if (!isNaN(value)) onKPIUpdate(index, value);
                      }
                    }}
                    className="inline-flex text-xs leading-5 font-semibold rounded-full px-2 py-1 bg-white/50 hover:bg-white/75"
                  >
                    更新
                  </button>
                </div>
              </div>
              <div className="overflow-hidden h-2 text-xs flex rounded bg-white/30">
                <div
                  style={{ width: `${(kpi.current / kpi.target) * 100}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-current opacity-75"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {milestone.dependencies && milestone.dependencies.length > 0 && (
        <div className="mt-4 pt-4 border-t border-current border-opacity-20">
          <p className="text-sm opacity-75">
            依赖项: {milestone.dependencies.join(', ')}
          </p>
        </div>
      )}
    </div>
  );
};

export default ProgressCard;

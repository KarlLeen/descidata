'use client';

import React, { useEffect, useState } from 'react';
import { Chart } from 'react-google-charts';
import { format } from 'date-fns';
import { Phase, Milestone, GanttChartProps } from './types';

const GanttChart: React.FC<GanttChartProps> = ({ phases, onMilestoneUpdate, onKPIUpdate }) => {
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const formatDataForChart = () => {
      const data = [
        [
          { type: 'string', label: 'Task ID' },
          { type: 'string', label: 'Task Name' },
          { type: 'string', label: 'Resource' },
          { type: 'date', label: 'Start Date' },
          { type: 'date', label: 'End Date' },
          { type: 'number', label: 'Duration' },
          { type: 'number', label: 'Percent Complete' },
          { type: 'string', label: 'Dependencies' },
        ],
      ];

      phases.forEach((phase) => {
        // Add phase row
        data.push([
          phase.id,
          phase.name,
          'Phase',
          phase.startDate,
          phase.endDate,
          null,
          phase.progress,
          null,
        ]);

        // Add milestone rows
        phase.milestones.forEach((milestone) => {
          data.push([
            milestone.id,
            milestone.name,
            'Milestone',
            milestone.startDate,
            milestone.endDate,
            null,
            milestone.progress,
            milestone.dependencies?.join(',') || null,
          ]);
        });
      });

      return data;
    };

    setChartData(formatDataForChart());
  }, [phases]);

  const options = {
    height: 400,
    gantt: {
      trackHeight: 30,
      criticalPathEnabled: true,
      arrow: {
        angle: 100,
        width: 2,
        color: '#3366CC',
        radius: 0,
      },
    },
  };

  const handleChartSelect = (chartWrapper: any) => {
    const selection = chartWrapper.getChart().getSelection();
    if (selection && selection.length > 0 && onMilestoneUpdate) {
      const rowIndex = selection[0].row;
      const selectedData = chartData[rowIndex];
      const milestoneId = selectedData[0];
      
      // Find the milestone in phases
      phases.forEach((phase) => {
        const milestone = phase.milestones.find((m) => m.id === milestoneId);
        if (milestone) {
          // Open a modal or form to update progress
          const newProgress = prompt('Enter new progress (0-100):', milestone.progress.toString());
          if (newProgress !== null) {
            onMilestoneUpdate(milestoneId, parseInt(newProgress, 10));
          }
        }
      });
    }
  };

  return (
    <div className="w-full p-4 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Project Timeline</h2>
      {chartData.length > 1 ? (
        <Chart
          chartType="Gantt"
          width="100%"
          height="400px"
          data={chartData}
          options={options}
          chartEvents={[
            {
              eventName: 'select',
              callback: handleChartSelect,
            },
          ]}
        />
      ) : (
        <div className="flex items-center justify-center h-[400px]">
          <p className="text-gray-500">Loading timeline...</p>
        </div>
      )}
      
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">KPI Tracking</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {phases.map((phase) =>
            phase.milestones.map((milestone) => (
              <div
                key={milestone.id}
                className="p-4 border rounded-lg bg-gray-50"
              >
                <h4 className="font-medium mb-2">{milestone.name}</h4>
                {milestone.kpis.map((kpi, index) => (
                  <div key={`${milestone.id}-kpi-${index}`} className="mb-2">
                    <p className="text-sm text-gray-600">{kpi.metric}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${(kpi.current / kpi.target) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm">
                        {kpi.current}/{kpi.target}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default GanttChart;

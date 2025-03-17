import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { BarChart, LineChart } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface TaskAnalyticsProps {
  tasks: {
    completed: boolean;
    createdAt: Date;
  }[];
}

type TimeRange = 'week' | 'month';
type ChartType = 'line' | 'bar';

const TaskAnalytics: React.FC<TaskAnalyticsProps> = ({ tasks }) => {
  const { currentTheme } = useTheme();
  const [timeRange, setTimeRange] = useState<TimeRange>('week');
  const [chartType, setChartType] = useState<ChartType>('line');

  const getDateLabels = () => {
    const today = new Date();
    const labels = [];
    const days = timeRange === 'week' ? 7 : 30;

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      labels.push(date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      }));
    }
    return labels;
  };

  const getCompletedTasksData = () => {
    const today = new Date();
    const days = timeRange === 'week' ? 7 : 30;
    const data = new Array(days).fill(0);

    tasks.forEach(task => {
      const taskDate = new Date(task.createdAt);
      const diffTime = Math.abs(today.getTime() - taskDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) - 1;

      if (diffDays < days && task.completed) {
        data[days - 1 - diffDays]++;
      }
    });

    return data;
  };

  const chartData: ChartData<'line' | 'bar'> = {
    labels: getDateLabels(),
    datasets: [
      {
        label: 'Completed Tasks',
        data: getCompletedTasksData(),
        borderColor: '#fff',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#fff',
        },
      },
      title: {
        display: true,
        text: 'Task Completion Analytics',
        color: '#fff',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#fff',
          stepSize: 1,
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      x: {
        ticks: {
          color: '#fff',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          <button
            onClick={() => setTimeRange('week')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              timeRange === 'week'
                ? 'backdrop-blur-sm bg-white/20 text-white'
                : 'text-white/70 hover:bg-white/10'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setTimeRange('month')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              timeRange === 'month'
                ? 'backdrop-blur-sm bg-white/20 text-white'
                : 'text-white/70 hover:bg-white/10'
            }`}
          >
            Month
          </button>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setChartType('line')}
            className={`p-2 rounded-lg transition-colors ${
              chartType === 'line'
                ? 'backdrop-blur-sm bg-white/20 text-white'
                : 'text-white/70 hover:bg-white/10'
            }`}
          >
            <LineChart className="w-5 h-5" />
          </button>
          <button
            onClick={() => setChartType('bar')}
            className={`p-2 rounded-lg transition-colors ${
              chartType === 'bar'
                ? 'backdrop-blur-sm bg-white/20 text-white'
                : 'text-white/70 hover:bg-white/10'
            }`}
          >
            <BarChart className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="h-64">
        {chartType === 'line' ? (
          <Line data={chartData} options={chartOptions} />
        ) : (
          <Bar data={chartData} options={chartOptions} />
        )}
      </div>
    </div>
  );
};

export default TaskAnalytics;
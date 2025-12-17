'use client';

import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, YAxis, Tooltip } from 'recharts';
import MetricCard from './MetricCard';
import { fetchPortfolioData } from '../utils/api';
import { PortfolioData, ChartDataPoint } from '../types/portfolio';

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: { index: number };
  }>;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card-bg px-3 py-2 rounded-lg shadow-lg border border-border">
        <p className="text-sm font-semibold text-gray-700">
          €{(payload[0].value / 1000).toFixed(1)}K on Dec {10 + Math.floor(payload[0].payload.index / 2)}
        </p>
      </div>
    );
  }
  return null;
};

const PortfolioWidget = () => {
  // State management with proper types
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Function to load/reload data
  const loadData = async (): Promise<void> => {
    try {
      setRefreshing(true);
      setError(null);
      const response = await fetchPortfolioData();
      setData(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load portfolio data');
      setLoading(false);
      console.error('Error loading portfolio data:', err);
    } finally {
      setRefreshing(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  // Refresh button handler
  const handleRefresh = (): void => {
    loadData();
  };

  // Loading state
  if (loading && !data) {
    return (
      <div className="w-full max-w-5xl mx-auto p-4">
        <div className="bg-card-bg rounded-3xl shadow-xl p-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6">
        <div className="rounded-xl shadow-sm p-8 border bg-card-bg border-border">
          <div className="text-center text-red-600">{error}</div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  // Transform sparkline data for Recharts
  const chartData: ChartDataPoint[] = data.sparkline_data.values.map((value, index) => ({
    value,
    index
  }));

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        <div className="bg-card-bg rounded-4xl shadow-[0_-8px_30px_rgba(0,0,0,0.12),0_8px_30px_rgba(0,0,0,0.12)] overflow-hidden relative">
          {/* Header Section */}
          <div className="px-8 py-6 flex items-center justify-between mb-4">
            <h2 className="text-4xl font-bold text-gray-900 tracking-tight">
              {data.title}
            </h2>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center justify-center w-14 h-14 rounded-full cursor-pointer bg-button-bg hover:opacity-80 disabled:opacity-50 transition-all duration-200 disabled:cursor-not-allowed border-2 border-white"
              aria-label="Refresh data"
            >
              <RefreshCw 
                className={`w-8 h-8 text-icon ${refreshing ? 'animate-spin' : ''}`}
              />
            </button>
          </div>

          {/* Metrics Grid */}
          <div className="px-8 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y-2 md:divide-y-0 md:divide-x-2 divide-gray-300 border-b-2 border-gray-300 pb-6">
              {data.metrics.map((metric) => (
                <MetricCard key={metric.id} metric={metric} />
              ))}
            </div>
          </div>
              
          {/* Sparkline Chart Section */}
          <div className="px-8 pb-8">
            <div className="relative bg-card-bg  p-6 pt-8">
              {/* Chart */}
              <div className="h-40 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <defs>
                      <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#368B52" stopOpacity={0.3}/>
                        <stop offset="100%" stopColor="#368B52" stopOpacity={0.05}/>
                      </linearGradient>
                    </defs>
                    <YAxis hide domain={['dataMin - 2000', 'dataMax + 2000']} />
                    <Tooltip content={<CustomTooltip />} cursor={false} />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#368B52"
                      strokeWidth={3}
                      dot={false}
                      fill="url(#colorGradient)"
                      animationDuration={800}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              {/* Time Label */}
              <div className="flex justify-end mt-2">
                <span className="text-sm font-medium text-gray-500">
                  {data.sparkline_data.label}
                </span>
              </div>
            </div>
          </div>

        
        </div>
      </div>
    </div>
  );
};

export default PortfolioWidget;
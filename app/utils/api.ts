import { ApiResponse } from '../types/portfolio';

/**
 * Mock API function that simulates fetching portfolio data
 * Returns randomized data on each call
 */
export const fetchPortfolioData = async (): Promise<ApiResponse> => {
  // Simulate network delay (500-1000ms)
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));
  
  // Generate randomized values
  const baseAssets = 520000;
  const assetVariation = (Math.random() - 0.5) * 50000;
  const totalAssets = baseAssets + assetVariation;
  
  const baseDailyGain = 4500;
  const gainVariation = (Math.random() - 0.5) * 2000;
  const dailyGain = baseDailyGain + gainVariation;
  
  const baseGrowth = 8.7;
  const growthVariation = (Math.random() - 0.5) * 3;
  const growthRate = baseGrowth + growthVariation;
  
  // Generate sparkline data for 7 days
  const sparklineValues: number[] = Array.from({ length: 7 }, () => {
    const base = 3000;
    const variation = (Math.random() - 0.5) * 2000;
    return Math.round(base + variation);
  });
  
  return {
    status: "success",
    data: {
      title: "Portfolio Performance",
      metrics: [
        {
          id: "total_assets",
          label: "Total Assets",
          value: Math.round(totalAssets),
          format: "currency",
          unit: "€"
        },
        {
          id: "daily_gain",
          label: "Daily Gain",
          value: Math.round(dailyGain),
          format: "currency",
          unit: "€"
        },
        {
          id: "growth_rate",
          label: "Growth Rate",
          value: parseFloat(growthRate.toFixed(2)),
          format: "percent",
          unit: "%"
        }
      ],
      sparkline_data: {
        label: "Last 7 Days",
        values: sparklineValues
      }
    }
  };
};
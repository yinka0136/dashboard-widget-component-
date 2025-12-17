export interface Metric {
  id: string;
  label: string;
  value: number;
  format: 'currency' | 'percent';
  unit: string;
}

export interface SparklineData {
  label: string;
  values: number[];
}

export interface PortfolioData {
  title: string;
  metrics: Metric[];
  sparkline_data: SparklineData;
}

export interface ApiResponse {
  status: string;
  data: PortfolioData;
}

export interface ChartDataPoint {
  value: number;
  index: number;
}
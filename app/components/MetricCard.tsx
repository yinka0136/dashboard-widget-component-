import { Metric } from '../types/portfolio';

interface MetricCardProps {
  metric: Metric;
}

const MetricCard = ({ metric }: MetricCardProps) => {
  // Format value based on type (currency or percent)
  const formatValue = (value: number, format: string, unit: string, label: string): string => {
    // Format currency values for Total Assets and Daily Gain as K format
    if (format === "currency" && (label === "Total Assets" || label === "Daily Gain")) {
      const absValue = Math.abs(value);
      const kValue = (absValue / 1000).toFixed(1);
      const formattedNumber = `${unit}${kValue}K`;
      
      // Add +/- prefix for Daily Gain
      if (label === "Daily Gain") {
        return value >= 0 ? `+${formattedNumber}` : `-${formattedNumber}`;
      }
      
      return formattedNumber;
    }
    
    const formattedNumber = format === "currency" 
      ? `${unit}${value.toLocaleString('en-US')}` 
      : `${value}${unit}`;
    
    return formattedNumber;
  };

  // Get color based on value for Daily Gain
  const getValueColor = (): string => {
    if (metric.label === "Daily Gain" || metric.label === "Total Assets") {
      return metric.value >= 0 ? 'text-primary' : 'text-red-600';
    }
    return metric.format === 'currency' ? 'text-primary' : 'text-icon';
  };

  return (
    <div className="flex flex-col gap-2.5 p-4 items-center text-center">
      <span className="text-2xl font-semibold text-gray-600 tracking-wide">{metric.label}</span>
      <div className="flex items-baseline gap-2 justify-center">
        <span className={`text-6xl font-bold tracking-tight ${getValueColor()}`}>
          {formatValue(metric.value, metric.format, metric.unit, metric.label)}
        </span>

      </div>
    </div>
  );
};

export default MetricCard;
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { TooltipProps } from 'recharts';

type ChartData = {
  name: 'INCOME' | 'EXPANSES' | 'SAVING' | string;
  value: number;
  currency: string;
  month?: number;
  year?: number;
};

const CustomTooltip = ({
  active,
  payload,
}: TooltipProps<number, string> & {
  active?: boolean;
  payload?: Array<{ payload: ChartData }>;
}) => {
  if (active && payload?.[0]) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-2 border border-gray-200 rounded shadow">
        <p className="font-medium">{data.name}</p>
        <p className="text-gray-600">{`${data.value.toLocaleString()} ${data.currency}`}</p>
      </div>
    );
  }
  return null;
};

const getBarColor = (name?: string) => {
  switch (name) {
    case 'INCOME':
      return '#0088FE';
    case 'EXPANSES':
      return '#00C49F';
    case 'SAVING':
      return '#FFBB28';
    default:
      return '#8884d8';
  }
};

export const ChartBox = ({
  data,
  title,
}: {
  data?: ChartData[];
  title?: string;
}) => {
  if (!data) return null;

  const coloredData = data.map((item) => ({
    ...item,
    fill: getBarColor(item.name),
  }));

  return (
    <div className="p-4 rounded-xl shadow-lg">
      {title && <h3 className="text-lg font-semibold mb-2">{title}</h3>}
      <ResponsiveContainer width={375} height={175}>
        <BarChart
          data={coloredData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

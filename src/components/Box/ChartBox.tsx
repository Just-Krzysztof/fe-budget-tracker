import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { TooltipProps } from 'recharts';

type ChartData = {
  id: string;
  type: 'INCOME' | 'EXPENSE' | 'SAVING' | string;
  currency: string;
  amount: number;
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
        <p className="font-medium">{data.type}</p>
        <p className="text-gray-600">{`${data.amount.toLocaleString()} ${data.currency}`}</p>
      </div>
    );
  }
  return null;
};

const getBarColor = (type?: string) => {
  console.log('type',type);
  
  switch (type) {
    case 'INCOME':
      return '#0088FE';
    case 'EXPENSE':
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

  // Group entries by type and sum their amounts
  const groupedData = Object.values(
    data.reduce<Record<string, ChartData & { amount: number }>>((acc, item) => {
      const amt = typeof item.amount === 'string' ? parseFloat(item.amount) : item.amount;
      if (acc[item.type]) {
        acc[item.type].amount += amt;
      } else {
        acc[item.type] = { ...item, amount: amt };
      }
      return acc;
    }, {})
  );
  // Sort grouped entries by type
  groupedData.sort((a, b) => a.type.localeCompare(b.type));
  // Assign fill colors
  const coloredData = groupedData.map((item) => ({
    ...item,
    fill: getBarColor(item.type),
  }));

  console.log('coloredData',coloredData);
  

  return (
    <div className="p-4 rounded-xl shadow-lg">
      {title && <h3 className="text-lg font-semibold mb-2">{title}</h3>}
      <div className="w-[375px] h-[175px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={coloredData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="type" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="amount">
              {coloredData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

interface GoalData {
  id: string;
  currentAmount: number;
  targetAmount: number;
  deadline: string;
  currency: string;
  name: string;
}

interface BoxProps {
  data?: GoalData;
  type?: 'goal' | 'add';
  onClick?: () => void;
}

export const Box = ({ data, type = 'goal', onClick }: BoxProps) => {
  const formatDeadline = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${month}/${day}/${year}`;
  };

  const isAddTile = type === 'add';

  return (
    <div
      className={`
        flex-grow flex-shrink basis-64 p-4 rounded-xl shadow-lg
        ${
          isAddTile
            ? 'border-2 border-dashed border-gray-400 bg-white text-gray-500 cursor-pointer hover:border-blue-500 hover:text-blue-500 transition-colors duration-200 flex flex-col items-center justify-center'
            : 'border border-gray-200 shadow-gray-300 bg-white'
        }
      `}
      onClick={isAddTile ? onClick : undefined}
    >
      {isAddTile ? (
        <>
          <svg
            className="w-10 h-10"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            ></path>
          </svg>
          <span className="mt-2 font-semibold">Add new goal</span>
        </>
      ) : data ? (
        <>
          <h4 className="pb-1">{data.name}</h4>
          <p className="pb-2">
            {data.currentAmount}
            {data.currency} / {data.targetAmount}
            {data.currency}
          </p>
          <p className="border-t-1 border-gray-200 text-gray-600">
            to: {formatDeadline(data.deadline)}
          </p>
        </>
      ) : (
        <p className="text-gray-500">No data provided.</p>
      )}
    </div>
  );
};

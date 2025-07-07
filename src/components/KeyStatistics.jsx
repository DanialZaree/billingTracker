import { formatCurrency } from "../utils/helpers";

const KeyStatistics = ({ total, count }) => {
  const average = count > 0 ? total / count : 0;

  return (
    <div className="mb-8">
      <h2 className="mb-4 text-xl font-bold text-gray-800 dark:text-gray-100 font-poppins">
        Key Statistics
      </h2>
      <div className="grid grid-cols-1 gap-4 text-left sm:grid-cols-3">
        <div className="p-5 bg-white border shadow-sm rounded-xl border-gray-200/80 dark:bg-gray-800 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Spend</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-500 font-poppins">
            {formatCurrency(total)}
          </p>
        </div>
        <div className="p-5 bg-white border shadow-sm rounded-xl border-gray-200/80 dark:bg-gray-800 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg. Bill</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-500 font-poppins">
            {formatCurrency(average)}
          </p>
        </div>
        <div className="p-5 bg-white border shadow-sm rounded-xl border-gray-200/80 dark:bg-gray-800 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Number of Bills</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-500 font-poppins">
            {count}
          </p>
        </div>
      </div>
    </div>
  );
};

export default KeyStatistics;

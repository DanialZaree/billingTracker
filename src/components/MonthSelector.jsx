const MonthSelector = ({ selectedView, setSelectedView }) => {
  const selections = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
    "Full Year",
  ];

  return (
    <div className="pb-2 mb-8 overflow-x-auto">
      <div className="flex justify-start p-1 rounded-full w-max sm:w-full sm:justify-between bg-gray-200/80 dark:bg-gray-700">
        {selections.map((name, index) => (
          <button
            key={name}
            onClick={() => setSelectedView(index)}
            className={`flex-1 px-3 py-1.5 text-sm sm:text-base font-semibold transition-colors duration-300 whitespace-nowrap rounded-full cursor-pointer
            ${
              selectedView === index
                ? "bg-green-500 text-white shadow-md dark:bg-green-600 dark:text-white"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-300/50 dark:hover:bg-gray-600/50"
            }`}
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MonthSelector;

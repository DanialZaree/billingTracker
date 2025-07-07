import React from 'react';
import { Trash2 } from 'lucide-react';
import IconComponent from './IconComponent';
import { formatCurrency } from '../utils/helpers';

const BillList = ({ bills, selectedView, onDelete }) => {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const listTitle = selectedView === 12 ? 'All Bills for 2025' : `Bills for ${months[selectedView]}`;
    let lastMonth = -1;

    return (
        <div className="p-4 bg-white shadow-lg sm:p-6 rounded-xl dark:bg-gray-800 dark:border dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 font-poppins">{listTitle}</h2>
            </div>
            <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2"> {/* Consider dark scrollbar for this specific element if needed */}
                {bills.length > 0 ? bills.map(bill => {
                    // Use a more robust date parsing method to avoid timezone issues
                    const billDate = new Date(bill.date);
                    const currentMonth = billDate.getUTCMonth();
                    let monthHeader = null;

                    if (selectedView === 12 && currentMonth !== lastMonth) {
                        lastMonth = currentMonth;
                        monthHeader = <h3 className="sticky top-0 pt-4 pb-2 font-bold text-gray-500 bg-white dark:bg-gray-800 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 z-10">{months[currentMonth]}</h3>;
                    }

                    return (
                        <React.Fragment key={bill.id}>
                            {monthHeader}
                            <div className="flex items-center p-3 border rounded-lg bg-gray-50 animate-fade-in border-gray-200/80 dark:bg-gray-700/50 dark:border-gray-600/80 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 mr-4 text-green-600 bg-green-100 rounded-full dark:bg-green-700/30 dark:text-green-400">
                                    <IconComponent name={bill.icon} />
                                </div>
                                <div className="flex-grow text-gray-800 dark:text-gray-200">
                                    <p className="font-semibold font-poppins">{bill.name}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{billDate.toLocaleDateString('en-US', { timeZone: 'UTC' })}</p>
                                </div>
                                <p className="mr-4 text-lg font-bold text-gray-800 dark:text-gray-100 font-poppins">{formatCurrency(parseFloat(bill.amount))}</p>
                                <button onClick={() => onDelete(bill.id)} className="text-gray-400 transition-colors hover:text-red-500 dark:hover:text-red-400">
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </React.Fragment>
                    );
                }) : (<div className="py-10 text-center"><p className="text-gray-500 dark:text-gray-400">No bills for this period.</p></div>)}
            </div>
        </div>
    );
};

export default BillList;
import React from 'react';
import { Trash2 } from 'lucide-react';
import IconComponent from './IconComponent';
import { formatCurrency } from '../utils/helpers';

const BillList = ({ bills, selectedView, onDelete }) => {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const listTitle = selectedView === 12 ? 'All Bills for 2025' : `Bills for ${months[selectedView]}`;
    let lastMonth = -1;

    return (
        <div className="p-4 bg-white shadow-lg sm:p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800 font-poppins">{listTitle}</h2>
            </div>
            <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2">
                {bills.length > 0 ? bills.map(bill => {
                    // Use a more robust date parsing method to avoid timezone issues
                    const billDate = new Date(bill.date);
                    const currentMonth = billDate.getUTCMonth();
                    let monthHeader = null;

                    if (selectedView === 12 && currentMonth !== lastMonth) {
                        lastMonth = currentMonth;
                        monthHeader = <h3 className="sticky top-0 pt-4 pb-2 font-bold text-gray-500 bg-white">{months[currentMonth]}</h3>;
                    }

                    return (
                        <React.Fragment key={bill.id}>
                            {monthHeader}
                            <div className="flex items-center p-3 border rounded-lg bg-gray-50 animate-fade-in border-gray-200/80">
                                <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 mr-4 text-green-600 bg-green-100 rounded-full">
                                    <IconComponent name={bill.icon} />
                                </div>
                                <div className="flex-grow text-gray-800">
                                    <p className="font-semibold font-poppins">{bill.name}</p>
                                    <p className="text-sm text-gray-500">{billDate.toLocaleDateString('en-US', { timeZone: 'UTC' })}</p>
                                </div>
                                <p className="mr-4 text-lg font-bold text-gray-800 font-poppins">{formatCurrency(parseFloat(bill.amount))}</p>
                                <button onClick={() => onDelete(bill.id)} className="text-gray-400 transition-colors hover:text-red-500">
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </React.Fragment>
                    );
                }) : (<div className="py-10 text-center"><p className="text-gray-500">No bills for this period.</p></div>)}
            </div>
        </div>
    );
};

export default BillList;
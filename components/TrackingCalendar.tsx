// import React, { useEffect, useState } from 'react';
// import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
// import { WritingStats, WritingTrackerCalendarProps } from '@/types';
// import Tooltip from '@mui/material/Tooltip';
// import { ChevronRight, ChevronLeft } from 'lucide-react';
// import { getUserWritingStats } from '@/lib/actions/library';
// import { useMyAuth } from '@/hooks/useAuth';

// const WritingTrackerCalendar: React.FC<WritingTrackerCalendarProps> = ({
//     year,
//     month,
//     entries,
// }) => {
//     const [currentMonth, setCurrentMonth] = useState(month);
//     const [currentYear, setCurrentYear] = useState(year);

//     useEffect(() => {
//         setCurrentMonth(month);
//         setCurrentYear(year);
//     }, [month, year]);

//     const startDate = startOfMonth(new Date(currentYear, currentMonth - 1));
//     const endDate = endOfMonth(startDate);
//     const days = eachDayOfInterval({ start: startDate, end: endDate });

//     const goToNextMonth = () => {
//         setCurrentMonth(prev => (prev === 12 ? 1 : prev + 1));
//         if (currentMonth === 12) setCurrentYear(prev => prev + 1);
//     };

//     const goToPreviousMonth = () => {
//         setCurrentMonth(prev => (prev === 1 ? 12 : prev - 1));
//         if (currentMonth === 1) setCurrentYear(prev => prev - 1);
//     };

//     const handleDateClick = (date: Date) => {
//         console.log('Clicked date:', date);
//     };

//     const entryMap = new Map(entries.map(entry => [entry.entry_date, entry]));

//     const firstDayOfWeek = startDate.getDay();

//     const getProgressColor = (progress: number) => {
//         if (progress === 0) return 'bg-gray-100';
//         if (progress < 25) return 'bg-green-100';
//         if (progress < 50) return 'bg-green-200';
//         if (progress < 75) return 'bg-green-300';
//         if (progress < 100) return 'bg-green-400';
//         if (progress === 100) return 'bg-green-600';
//     };

//     return (
//         <div className="bg-white p-6 md:p-10 rounded-lg shadow-md flex flex-col w-full max-w-2xl mx-auto">
//             <h2 className="text-lg md:text-xl font-semibold mb-4 text-center">Writing Tracker</h2>
//             <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-md md:text-lg font-medium">{format(startDate, 'MMMM yyyy')}</h3>
//                 <div className="flex space-x-2">
//                     <button title="previous month" onClick={goToPreviousMonth} className="p-2 rounded-md hover:bg-gray-200 transition">
//                         <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
//                     </button>
//                     <button title =" next month" onClick={goToNextMonth} className="p-2 rounded-md hover:bg-gray-200 transition">
//                         <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
//                     </button>
//                 </div>
//             </div>

//             <div className="grid grid-cols-7 gap-1 md:gap-2 text-center">
//                 {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
//                     <div key={day} className="text-xs md:text-sm font-semibold text-gray-500">
//                         {day}
//                     </div>
//                 ))}

//                 {[...Array(firstDayOfWeek)].map((_, index) => (
//                     <div key={`padding-${index}`} className=""></div>
//                 ))}

//                 {days.map(day => {
//                     const dateString = format(day, 'yyyy-MM-dd');
//                     const entry = entryMap.get(dateString);

//                     return (
//                         <div
//                             key={dateString}
//                             className="flex justify-center items-center mt-2"
//                             onClick={() => handleDateClick(day)}
//                         >
//                             <Tooltip title={entry ? `${entry.word_count} words` : '0 words'} arrow>
//                                 <div
//                                     className={`relative w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center cursor-pointer transition 
//                                     ${entry ? getProgressColor(entry.word_count) : 'bg-gray-100 hover:bg-gray-200'}`}
//                                 >
//                                     <span className="text-xs md:text-sm">{format(day, 'd')}</span>
//                                     {entry && entry.word_count > 0 && (
//                                         <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
//                                     )}
//                                 </div>
//                             </Tooltip>
//                         </div>
//                     );
//                 })}
//             </div>
//         </div>
//     );
// };

// export default function Page() {
//     const { token, user } = useMyAuth();
//     const [stat, setStat] = useState<WritingStats[]>([]);
//     const [loading, setLoading] = useState<boolean>(false);

//     useEffect(() => {
//         const getStats = async () => {
//             try {
//                 setLoading(true);
//                 const res = await getUserWritingStats(token);
//                 const stats = res.map(entry => ({
//                     entry_date: new Date(entry.entry_date).toISOString().split('T')[0],
//                     word_count: entry.word_count,
//                     user_id: entry.user_id,
//                     entry_count: entry.entry_count,
//                 }));
//                 if (!stats) {
//                     console.error("Invalid stats response:", stats);
//                     return;
//                 }
//                 setStat(stats);
//             } catch (error) {
//                 console.error("Error fetching user stats:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         getStats();
//     }, [token, user?.id]);

//     return (
//         <div className="container mx-auto p-4">
//             {loading ? <div className="text-gray-500 text-center">Loading...</div> : (
//                 <WritingTrackerCalendar
//                     year={new Date().getFullYear()}
//                     month={new Date().getMonth() + 1}
//                     entries={stat}
//                 />
//             )}
//         </div>
//     );
// }





import React, { useEffect, useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { WritingStats, WritingTrackerCalendarProps } from '@/types';
import Tooltip from '@mui/material/Tooltip';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { getUserWritingStats } from '@/lib/actions/library';
import { useMyAuth } from '@/hooks/useAuth';

const WritingTrackerCalendar: React.FC<WritingTrackerCalendarProps> = ({
    year,
    month,
    entries,
}) => {
    const [currentMonth, setCurrentMonth] = useState(month);
    const [currentYear, setCurrentYear] = useState(year);

    useEffect(() => {
        setCurrentMonth(month);
        setCurrentYear(year);
    }, [month, year]);

    const startDate = startOfMonth(new Date(currentYear, currentMonth - 1));
    const endDate = endOfMonth(startDate);
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    const goToNextMonth = () => {
        setCurrentMonth(prev => (prev === 12 ? 1 : prev + 1));
        if (currentMonth === 12) setCurrentYear(prev => prev + 1);
    };

    const goToPreviousMonth = () => {
        setCurrentMonth(prev => (prev === 1 ? 12 : prev - 1));
        if (currentMonth === 1) setCurrentYear(prev => prev - 1);
    };

    const handleDateClick = (date: Date) => {
        console.log('Clicked date:', date);
    };

    const entryMap = new Map(entries.map(entry => [entry.entry_date, entry]));

    const firstDayOfWeek = startDate.getDay();

    const getProgressColor = (progress: number) => {
        if (progress === 0) return 'bg-gray-100';
        if (progress < 25) return 'bg-green-100';
        if (progress < 50) return 'bg-green-200';
        if (progress < 75) return 'bg-green-300';
        if (progress < 100) return 'bg-green-400';
        if (progress === 100) return 'bg-green-600';
    };

    return (
        <div className="bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-md flex flex-col w-full max-w-2xl mx-auto">
            <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-2 sm:mb-4 text-center">Writing Tracker</h2>
            
            <div className="flex justify-between items-center mb-2 sm:mb-4">
                <h3 className="text-sm sm:text-md md:text-lg font-medium">{format(startDate, 'MMMM yyyy')}</h3>
                <div className="flex space-x-1 sm:space-x-2">
                    <button 
                        title="Previous month" 
                        onClick={goToPreviousMonth} 
                        className="p-1 sm:p-2 rounded-md hover:bg-gray-200 transition"
                    >
                        <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                    </button>
                    <button 
                        title="Next month" 
                        onClick={goToNextMonth} 
                        className="p-1 sm:p-2 rounded-md hover:bg-gray-200 transition"
                    >
                        <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center">
                {/* Weekday headers */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-xs font-semibold text-gray-500 mb-1">
                        {day}
                    </div>
                ))}

                {/* Empty cells for padding at start of month */}
                {[...Array(firstDayOfWeek)].map((_, index) => (
                    <div key={`padding-${index}`} className="aspect-square"></div>
                ))}

                {/* Calendar days */}
                {days.map(day => {
                    const dateString = format(day, 'yyyy-MM-dd');
                    const entry = entryMap.get(dateString);

                    return (
                        <div
                            key={dateString}
                            className="aspect-square flex justify-center items-center"
                            onClick={() => handleDateClick(day)}
                        >
                            <Tooltip title={entry ? `${entry.word_count} words` : '0 words'} arrow>
                                <div
                                    className={`
                                        relative aspect-square w-full max-w-full
                                        rounded-full flex items-center justify-center 
                                        cursor-pointer transition
                                        pt-[100%]
                                        ${entry ? getProgressColor(entry.word_count) : 'bg-gray-100 hover:bg-gray-200'}
                                    `}
                                    // style={{
                                    //     // Ensure element remains circular with padding based on its width
                                    //     paddingTop: '100%'
                                    // }}
                                >
                                    <span className="absolute inset-0 flex items-center justify-center text-xs">
                                        {format(day, 'd')}
                                    </span>
                                    {entry && entry.word_count > 0 && (
                                        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
                                    )}
                                </div>
                            </Tooltip>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default function Page() {
    const { token, user } = useMyAuth();
    const [stat, setStat] = useState<WritingStats[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const getStats = async () => {
            try {
                setLoading(true);
                const res = await getUserWritingStats(token);
                const stats = res.map(entry => ({
                    entry_date: new Date(entry.entry_date).toISOString().split('T')[0],
                    word_count: entry.word_count,
                    user_id: entry.user_id,
                    entry_count: entry.entry_count,
                }));
                if (!stats) {
                    console.error("Invalid stats response:", stats);
                    return;
                }
                setStat(stats);
            } catch (error) {
                console.error("Error fetching user stats:", error);
            } finally {
                setLoading(false);
            }
        };

        getStats();
    }, [token, user?.id]);

    return (
        <div className="container mx-auto p-2 sm:p-4">
            {loading ? <div className="text-gray-500 text-center">Loading...</div> : (
                <WritingTrackerCalendar
                    year={new Date().getFullYear()}
                    month={new Date().getMonth() + 1}
                    entries={stat}
                />
            )}
        </div>
    );
}
"use client"
import React, { useCallback, useEffect, useRef } from 'react'
import { useMyAuth } from '@/hooks/useAuth'
import { Book, ChevronLeft, ChevronRight, LucideProps, Timer } from 'lucide-react'
import { timeAgo } from '@/lib/utils'
import { useSidebarStore } from '@/store/useSidebarStore'
import { Library } from '@/types'
import { getLibraries } from '@/lib/actions/library'
import { useRouter } from 'next/navigation'

const RecentDiaries = () => {

    const { token, user } = useMyAuth()
    const { fetchDiaryEntries, setActiveEntry, } = useSidebarStore();
    const [diaries, setDiaries] = React.useState<Library[]>()
    const [loading, setLoading] = React.useState<boolean>(false);
    const [showLeftShadow, setShowLeftShadow] = React.useState(false);
    const [showRightShadow, setShowRightShadow] = React.useState(true);
    const router = useRouter();

    const scrollRef = useRef<HTMLDivElement>(null);
    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({
                left: direction === "left" ? -300 : 300,
                behavior: "smooth",
            });
        }
    };

    const handleScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setShowLeftShadow(scrollLeft > 0);
            setShowRightShadow(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    const handleEntryClick = useCallback(
        (entry: Library) => {
            setActiveEntry(entry.id);
            router.push(`/${entry.id}`);
        },
        [setActiveEntry, router]
    );

    useEffect(() => {
        const fetchDiaries = async (token: string) => {
            try {
                setLoading(true);
                const diary = await getLibraries(token);
                setDiaries(diary)
            } catch (err) {
                console.error("Error in fetchDiaryEntries:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchDiaries(token)
    }, [token, user?.id, fetchDiaryEntries]);

    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (scrollContainer) {
            scrollContainer.addEventListener('scroll', handleScroll);
            handleScroll();

            return () => {
                scrollContainer.removeEventListener('scroll', handleScroll);
            };
        }
    }, [diaries]);


    return (


       <div>

            {loading ? <div className="px-4 py-2 flex items-center mb-4">
                <div className="h-2 w-4 rounded bg-[#312f2f] animate-pulse mr-2"></div>
                <div className="h-2 w-20 rounded bg-[#312f2f] animate-pulse"></div>
            </div> : <div className='flex gap-1 justify-start mb-4 text-gray-500'>
                <Timer />
                <p>dive Right back in</p>
            </div>} 
            
            <div className='relative '>


            {showLeftShadow &&
                <button
                    title="Scroll left"
                    type="button"
                    className="absolute left-0 z-20 p-2 top-1/2 -translate-y-1/2 bg-black/50 rounded-full hover:bg-black/70 transition cursor-pointer flex items-center justify-center"
                    onClick={() => scroll("left")}
                >
                    <ChevronLeft className="text-white w-6 h-6" />
                </button>
            }

            {showLeftShadow && (
                <div
                    className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none border-shadow-left"
                />
            )}




            <div
                ref={scrollRef}
                className='flex gap-8 overflow-x-auto  scrollbar-hidden scroll-smooth max-w-[700px] p-2 '>
                {loading
                    ? Array.from({ length: 3 }, (_, index) => <DiaryEntryShimmer key={index} />)
                    : diaries && diaries.length > 0
                        ? diaries.map((diary) => (<DiaryEntry key={diary.id} icon={Book} diary={diary} onClick={() => handleEntryClick(diary)} />))
                        : <p>no Diaries found</p>
                }


            </div>
            {showRightShadow && (
                <div
                    className="absolute right-0 h-full top-0 bottom-0 w-16 z-10 pointer-events-none border-shadow-right"

                />
            )}
            {showRightShadow && (
                <button
                    title="Scroll right"
                    className="absolute right-0 z-20 p-2 top-1/2 -translate-y-1/2 bg-black/50 rounded-full hover:bg-black/70 transition cursor-pointer flex items-center justify-center"
                    onClick={() => scroll("right")}
                >
                    <ChevronRight className="text-white w-6 h-6" />
                </button>
            )}

        </div>
        </div>


    )


}

export default RecentDiaries;

const DiaryEntry = ({ icon: Icon, diary, onClick } : { icon: React.FC<LucideProps>, diary: Library, onClick: (entry: Library) => void }) => (

    <div
        onClick={() => onClick(diary)}
        className='relative flex flex-col justify-between items-start w-[150px]  h-[150px] p-4 text-[#b7bdc1] rounded-xl bg-[#312f2f] hover:cursor-pointer'>
        <div className="relative z-10 flex flex-col justify-between flex-shrink-0 items-start w-full overflow-hidden h-full">
            <Icon className="h-4 w-4 text-[#676969]" />
            <p className='truncate w-[150px] '>{diary?.title}</p>
            <p className='text-xs text-gray-500'>{timeAgo(diary?.updated_at)}</p>
        </div>

    </div>

)

const DiaryEntryShimmer = () => (
    <div className="h-[150px] w-full rounded bg-[#312f2f] animate-pulse mr-2"></div>

)
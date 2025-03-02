// components/Sidebar/index.tsx
"use client"
import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, ChevronLeft, Home, Settings, Plus, Book } from 'lucide-react';
import { useSidebarStore } from '@/store/useSidebarStore';
import { LibraryEntry } from '@/types/index';
import ShimmerEffect from '@/components/sidebar/ShimmerEffect';
import { useUser } from '@clerk/nextjs';
import { getInitials } from '@/lib/utils';

const Sidebar = () => {
    const path = usePathname();
    const router = useRouter();
    const {isLoaded, user } = useUser();
    console.log(path);

    const {
        isCollapsed,
        isLoading,
        libraryEntries,
        activeEntryId,
        toggleSidebar,
        setActiveEntry,
        fetchLibraryEntries
    } = useSidebarStore();

    useEffect(() => {
        fetchLibraryEntries();
    }, [fetchLibraryEntries]);

    useEffect(() => {
        const match = path.match(/\/([^:]+)/);
        
        if (match && match[1]) {
          setActiveEntry(match[1]);
        }
      }, [path, setActiveEntry]);

    const handleEntryClick = (entry: LibraryEntry) => {
        setActiveEntry(entry.id);
        router.push(`/${entry.id}:${entry.title.replace(/\s+/g, '-').toLowerCase()}`);
    };

    return (
        <div
            className={`flex flex-col h-screen bg-[#fbfbfa] border-r border-[#e6e6e6] transition-all duration-200 ${isCollapsed ? 'w-14' : 'w-64'
                }`}
        >
            {/* Sidebar Header */}
            <div className="p-4 flex items-center justify-between border-b border-[#e6e6e6]">
                {!isCollapsed && (
                    <div className="flex items-center space-x-2">
                        <Book className="h-5 w-5 text-gray-600" />
                        <span className="font-medium text-gray-800">AI Library</span>
                    </div>
                )}
                <button
                    onClick={toggleSidebar}
                    className="p-1 rounded hover:bg-gray-200 transition-colors"
                >
                    {isCollapsed ? (
                        <ChevronRight className="h-4 w-4 text-gray-500" />
                    ) : (
                        <ChevronLeft className="h-4 w-4 text-gray-500" />
                    )}
                </button>
            </div>

            {/* Navigation Links */}
            <div className="py-2">
                <Link
                    href="/"
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                >
                    <Home className="h-4 w-4 mr-2" />
                    {!isCollapsed && <span>Home</span>}
                </Link>
                <Link
                    href="/settings"
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                >
                    <Settings className="h-4 w-4 mr-2" />
                    {!isCollapsed && <span>Settings</span>}
                </Link>
            </div>

            {/* Library Entries Section */}
            <div className="flex-1 overflow-y-auto">
                {/* Section Header */}
                <div className="px-4 py-2 flex items-center justify-between">
                    {!isCollapsed && <span className="text-xs font-medium text-gray-500">LIBRARIES</span>}
                    {!isCollapsed && (
                        <button title="Add Library" className="p-1 rounded hover:bg-gray-200 transition-colors">
                            <Plus className="h-3 w-3 text-gray-500" />
                        </button>
                    )}
                </div>

                {/* Library Entries List with Shimmer */}
                <div className="mt-1">
                    {isLoading ? (
                        // Shimmer Loading Effect
                        <>
                            {!isCollapsed && Array(5).fill(0).map((_, index) => (
                                <ShimmerEffect key={index} />
                            ))}
                        </>
                    ) : (
                        // Actual Library Entries
                        <>
                            {libraryEntries.map((entry) => (
                                <div
                                    key={entry.id}
                                    onClick={() => handleEntryClick(entry)}
                                    className={`flex items-center px-4 py-2 cursor-pointer transition-colors ${activeEntryId === entry.id ? 'bg-[#efefef]' : 'hover:bg-gray-100'
                                        }`}
                                >
                                    {!isCollapsed ? (
                                        <>
                                            <div className="mr-2 text-gray-500">
                                                {entry.icon || <Book className="h-4 w-4" />}
                                            </div>
                                            <span className="text-sm text-gray-800 truncate">{entry.title}</span>
                                        </>
                                    ) : (
                                        <div className="mx-auto text-gray-500">
                                            {entry.icon || <Book className="h-4 w-4" />}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </>
                    )}
                </div>
            </div>

            {/* User Section */}
            <div className="p-4 border-t border-[#e6e6e6] flex items-center">
                <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-xs text-gray-600">
                    {getInitials(user?.fullName || "UserName Name")}
                </div>
                {!isCollapsed && (
                    isLoaded ? 
                    <div className="ml-2">
                        <div className="text-sm font-medium text-gray-800">{user?.fullName}</div>
                        <div className="text-xs text-gray-500">{user?.emailAddresses[0].emailAddress}</div>
                    </div> : 
                    <div>
                        <ShimmerEffect />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Sidebar;
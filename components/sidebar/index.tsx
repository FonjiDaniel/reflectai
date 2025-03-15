"use client"
import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, ChevronLeft, ChevronDown, Home, Settings, Plus, Book } from 'lucide-react';
import { useSidebarStore } from '@/store/useSidebarStore';
import { Library } from '@/types/index';
import ShimmerEffect from '@/components/sidebar/ShimmerEffect';
import { getInitials } from '@/lib/utils';
import { useMyAuth } from "@/hooks/useAuth"
import { createLibrary, } from '@/lib/actions/library';
import { useAuth } from '@clerk/nextjs';

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';



const Sidebar = () => {

    const { logout, user, token } = useMyAuth();
    const { signOut } = useAuth();


    const path = usePathname();
    const router = useRouter();
    console.log(path);


    const {
        isCollapsed,
        activeEntryId,
        diaryEntries,
        toggleSidebar,
        setActiveEntry,
        fetchDiaryEntries,
        loadingDiaries,
        setdiaries
    } = useSidebarStore();

    const libraryData = {
        title: "New page",
        description: "null",
        createdBy: user?.id || ''
    };

    const handleCreateLibrary = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token) {
            console.error('No user or token');
            return;
        }

        try {
            console.log(user)
            const newLibrary = await createLibrary(
                libraryData,
                token,
            );

            console.log('Library created:', newLibrary);
            setdiaries(newLibrary);
            setActiveEntry(newLibrary.id);
            router.push(`/${newLibrary.id}`)
        } catch (error) {
            console.error('Failed to create library', error);
        }
    };





    useEffect(() => {
        const fetchData = async () => {
            await fetchDiaryEntries(user?.id, token);
        };

        fetchData();
    }, [token, user?.id]);



    useEffect(() => {
        const match = path.match(/\/([^:]+)/);

        if (match && match[1]) {
            setActiveEntry(match[1]);
        }
    }, [path, setActiveEntry]);

    const handleEntryClick = (entry: Library) => {
        setActiveEntry(entry.id);
        router.push(`/${entry.id}`);
    };


    const handleLogout = () => {
        try {
            logout();

            signOut();

        } catch (er) {
            console.log(er);
        }

    }


    return (
        <div
            className={`flex flex-col h-screen bg-[#212121] border-r border-[#3b3a3a]  text-[#a8a5a5] transition-all duration-200 ${isCollapsed ? 'w-14' : 'w-64'
                }`}
        >
            {/* Sidebar Header */}
            <div className="p-4 flex items-center justify-between border-b border-[#3b3a3a]">
                {!isCollapsed && (
                    <div className="flex items-center space-x-2 justify-center">
                        <Avatar>
                            <AvatarImage className="" src="https://res.cloudinary.com/dwg1nr3cj/image/upload/v1741961733/reflectai%20Images/Untitled%20design%20%289%29.png" />
                        </Avatar>

                        <span className="font-bold text-2xl">Reflect</span>
                    </div>
                )}
                <button
                    onClick={toggleSidebar}
                    className="p-1 rounded hover:bg-[#312f2f] transition-colors"
                >
                    {isCollapsed ? (
                        <ChevronRight className="h-4 w-4 " />
                    ) : (
                        <ChevronLeft className="h-4 w-4 " />
                    )}
                </button>
            </div>

            {/* Navigation Links */}
            <div className="py-2">
                <Link
                    href="/home"
                    className="flex items-center px-4 py-2  hover:bg-[#312f2f] transition-colors"
                >
                    <Home className="h-4 w-4 mr-2" />
                    {!isCollapsed && <span>Home</span>}
                </Link>
                <Link
                    href="/settings"
                    className="flex items-center px-4 py-2  hover:bg-[#312f2f] transition-colors"
                >
                    <Settings className="h-4 w-4 mr-2" />
                    {!isCollapsed && <span>Settings</span>}
                </Link>
            </div>

            {/* Library Entries Section */}
            <div className="flex-1 overflow-y-auto">

                {/* Section Header */}
                <div className="px-4 py-2 flex items-center justify-between">
                    {!isCollapsed && <span className="text-xs font-medium text-gray-500">Recent diaries</span>}
                    {!isCollapsed && <Button variant="outline" className='border border-[#3b3a3a] bg-[#212121] hover:bg-[#312f2f] hover:text-white' onClick={handleCreateLibrary}><Plus className="h-3 w-3 " /></Button>}
                </div>

                {/* Library Entries Section */}
                <div className="mt-1">
                    {loadingDiaries ? (
                        <>
                            {!isCollapsed && Array(5).fill(0).map((_, index) => (
                                <ShimmerEffect key={index} />
                            ))}
                        </>
                    ) : (
                        <>
                            {diaryEntries.length > 0 && diaryEntries ? diaryEntries.map((entry) => (
                                <div
                                    key={entry.id}
                                    onClick={() => handleEntryClick(entry)}
                                    className={`flex items-center px-4 py-2 rounded cursor-pointer transition-colors ${activeEntryId === entry.id ? 'bg-[#312f2f] text-white' : 'hover:bg-[#312f2f]'
                                        }`}
                                >
                                    {!isCollapsed ? (
                                        <>
                                            <div className="mr-2 ">
                                                {entry.icon || <Book className="h-4 w-4" />}
                                            </div>
                                            <span className="text-sm truncate">{entry.title}</span>
                                        </>
                                    ) : (
                                        <div className="mx-auto">
                                            {entry.icon || <Book className="h-4 w-4" />}
                                        </div>
                                    )}
                                </div>
                            )) : <div className='flex p-5'>
                                No libraries found
                            </div>}
                        </>
                    )}
                </div>
            </div>

            {/* User Section */}
            <div className="p-4 border-t border-[#3b3a3a] flex items-center justify-center gap-2">
                <Avatar>
                    <AvatarImage src='avatar.com' />
                    <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
                </Avatar>

                {!isCollapsed && (
                    <div className="ml-2">
                        <div className="text-sm font-medium ">{user?.name}</div>
                        <div className="text-xs ">{user?.email}</div>
                    </div>

                )}
                {!isCollapsed && (

                    <DropdownMenu >
                        <DropdownMenuTrigger asChild>
                            <Button className='border-none hover:bg-[#212121] hover:text-[#817f7f] bg-[#212121] border-[#3b3a3a] ' variant={'outline'} ><ChevronDown /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-60">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem>
                                    Profile
                                    <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    Settings
                                    <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleLogout}>
                                Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}

            </div>

        </div>

    );
};

export default Sidebar;
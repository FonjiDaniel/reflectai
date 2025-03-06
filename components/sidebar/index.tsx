"use client"
import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, ChevronLeft, ChevronDown, Home, Settings, Plus, Book, Divide } from 'lucide-react';
import { useSidebarStore } from '@/store/useSidebarStore';
import { Library, LibraryEntry } from '@/types/index';
import ShimmerEffect from '@/components/sidebar/ShimmerEffect';
import { getInitials } from '@/lib/utils';
import { useMyAuth } from "@/hooks/useAuth"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createLibrary, getLibraries } from '@/lib/actions/library';
import { useAuth } from '@clerk/nextjs';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

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



const Sidebar = () => {
    const [title, setTitle] = useState<string>('');
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [description, setDescription] = useState<string>('');
    const [diaries, setDiaries] = useState<Library[]>();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { logout, user, token } = useMyAuth();
    const { signOut } = useAuth();


    const path = usePathname();
    const router = useRouter();
    console.log(path);

    const libraryData = {
        title,
        description,
        createdBy: user?.id || ''
    };

    const handleCreateLibrary = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token) {
            console.error('No user or token');
            return;
        }

        setIsCreating(true);

        try {
            console.log(title, description, user)
            const newLibrary = await createLibrary(
                libraryData,
                token,
            );

            console.log('Library created:', newLibrary);
            setTitle('');
            setDescription('');
        } catch (error) {
            console.error('Failed to create library', error);
        } finally {
            setIsCreating(false);
        }
    };



    const {
        isCollapsed,
        activeEntryId,
        toggleSidebar,
        setActiveEntry,
    } = useSidebarStore();


    useEffect(() => {
        const fetchData = async () => {
          if (token && user?.id) {
            console.log("Starting to fetch diary entries");
            setIsLoading(true);
            try {
              const diary = await getLibraries(token, user.id);
              console.log("Received diary entries:", diary);
              setDiaries(diary);
            } catch (err) {
              console.error("Error in fetchDiaryEntries:", err);
            } finally {
              setIsLoading(false);
            }
          } else {
            console.log("Missing token or user ID for fetching diaries");
          }
        };
      
        fetchData();
      }, [token, user?.id]);



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
            className={`flex flex-col h-screen bg-[#212121] border-r border-[#3b3a3a]  text-[#817f7f] transition-all duration-200 ${isCollapsed ? 'w-14' : 'w-64'
                }`}
        >
            {/* Sidebar Header */}
            <div className="p-4 flex items-center justify-between border-b border-[#3b3a3a]">
                {!isCollapsed && (
                    <div className="flex items-center space-x-2">
                        <Book className="h-5 w-5 text-gray-600" />
                        <span className="font-medium">AI Library</span>
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
                    href="/"
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
                    {!isCollapsed && <span className="text-xs font-medium text-gray-500">LIBRARIES</span>}
                    {!isCollapsed && (


                        <Popover>
                            <PopoverTrigger asChild className='border-[#3b3a3a] bg-[#212121] hover:bg-[#312f2f] '>
                                <Button variant="outline"><Plus className="h-3 w-3 " /></Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80 ">
                                <div className="grid gap-4">
                                    <div className="space-y-2">
                                        <h4 className="font-medium leading-none">Create a new Diary</h4>
                                        <p className="text-sm text-muted-foreground">
                                            Start with title and description to continue
                                        </p>
                                    </div>
                                    <div className="grid gap-2">
                                        <div className="grid grid-cols-3 items-center gap-4">
                                            <Label htmlFor="title">title</Label>
                                            <Input
                                                id="title"
                                                defaultValue=""
                                                className="col-span-2 h-8"
                                                onChange={(e) => setTitle(e.target.value)}
                                            />
                                        </div>
                                        <div className="grid grid-cols-3 items-center gap-4">
                                            <Label htmlFor="description">Description</Label>
                                            <Input
                                                id="description"
                                                defaultValue=""
                                                className="col-span-2 h-8"
                                                onChange={(e) => setDescription(e.target.value)}
                                            />
                                        </div>
                                        <div className='flex justify-center'>
                                            <Button onClick={handleCreateLibrary}>
                                                {isCreating ? "creating...." : "create"}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    )}
                </div>

                {/* Library Entries List with Shimmer */}
                <div className="mt-1">
                    {isLoading ? (
                        <>
                            {!isCollapsed && Array(5).fill(0).map((_, index) => (
                                <ShimmerEffect key={index} />
                            ))}
                        </>
                        ) : (
                            <>
                                {diaries?.map((entry) => (
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
                                ))}
                            </>
                        )}
                    </div>
            </div>

            {/* User Section */}
            <div className="p-4 border-t border-[#3b3a3a] flex items-center justify-between">
                <div className="h-8 w-8 rounded-full bg-[#514e4e] flex items-center justify-center text-xs ">
                    {getInitials(user?.name || "UserName Name")}
                </div>
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
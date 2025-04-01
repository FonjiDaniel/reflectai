"use client";

import React, { useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
    ChevronRight,
    ChevronLeft,
    ChevronDown,
    Home,
    Settings,
    Plus,
    MoreHorizontalIcon,
    PencilLine,
    Trash2,
    LucideProps,
} from "lucide-react";
import { useSidebarStore } from "@/store/useSidebarStore";
import { Library, User } from "@/types/index";
import ShimmerEffect from "@/components/sidebar/ShimmerEffect";
import { getInitials } from "@/lib/utils";
import { useMyAuth } from "@/hooks/useAuth";
import { createLibrary, deleteDiary } from "@/lib/actions/library";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Tooltip from '@mui/material/Tooltip';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { toast } from "sonner";

const Sidebar = () => {
    const { logout, user, token } = useMyAuth();
    const { signOut } = useAuth();
    const path = usePathname();
    const router = useRouter();

    const {
        isCollapsed,
        activeEntryId,
        diaryEntries,
        toggleSidebar,
        setActiveEntry,
        fetchDiaryEntries,
        loadingDiaries,
        setDiaries,
        updateDiariesOnDelete
    } = useSidebarStore();

    const diaryData = {
        title: "New page",
        description: "null",
        createdBy: user?.id,
    };

    const handleCreateLibrary = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return console.error("No user or token");

        try {
            const newDiary = await createLibrary(diaryData, token);
            if (!newDiary) console.error("Error creating diary");

            setDiaries(newDiary);
            setActiveEntry(newDiary.id);
            router.push(`/${newDiary.id}`);
        } catch (err) {
            console.error("Failed to create library", err);
        }
    };

    useEffect(() => {
        if (token) {
            fetchDiaryEntries(token);
        }
    }, [token, user?.id, fetchDiaryEntries]);

    useEffect(() => {
        const match = path.match(/\/([^:]+)/);
        if (match?.[1]) setActiveEntry(match[1]);
    }, [path, setActiveEntry]);

    const handleEntryClick = useCallback(
        (entry: Library) => {
            setActiveEntry(entry.id);
            router.push(`/${entry.id}`);
        },
        [setActiveEntry, router]
    );

    const handleLogout = () => {
        logout();
        signOut();
    };

    const handleDeleteDiary = async (token: string, id: string) => {

        try {
            const deletedDiary = await deleteDiary(token, id)
            if (deletedDiary?.id) toast.success("diary deleted successfull");
            updateDiariesOnDelete(deletedDiary!);
        } catch (err) {
            console.log(err);

        }
    }

    useEffect(() => {
        if (diaryEntries.length > 0) {
            setActiveEntry(diaryEntries[0].id);
            router.push(`/${diaryEntries[0].id}`);
        }
    }, [diaryEntries]);


    return (
        <div
            className={`flex flex-col h-screen bg-[#212121] border-r border-[#3b3a3a] text-[#a8a5a5] transition-all duration-200 ${isCollapsed ? "w-14" : "w-64"
                }`}
        >
            {/* Sidebar Header */}
            <div className="p-4 flex items-center justify-between border-b border-[#3b3a3a]">
                {!isCollapsed && (
                    <div className="flex items-center space-x-2 justify-center">
                        <Avatar>
                            <AvatarImage src="https://res.cloudinary.com/dwg1nr3cj/image/upload/v1741961733/reflectai%20Images/Untitled%20design%20%289%29.png" />
                        </Avatar>
                        <span className="font-bold text-2xl">Reflect</span>
                    </div>
                )}
                <button onClick={toggleSidebar} className="p-1 rounded hover:bg-[#312f2f] transition-colors">
                    {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                </button>
            </div>

            {/* Navigation Links */}
            <div className="py-2">
                <SidebarLink href="/home" icon={Home} label="Home" isCollapsed={isCollapsed} />
                <SidebarLink href="/settings" icon={Settings} label="Settings" isCollapsed={isCollapsed} />
            </div>

            {/* Library Entries Section */}
            <div className="flex-1 overflow-y-auto relative">
                <div className="sticky top-0 bg-[#212121] px-4 py-2 flex items-center justify-between z-10">
                    {!isCollapsed && <span className="text-xs font-medium text-gray-500">Recent diaries</span>}
                    {!isCollapsed && (
                        <Tooltip title="Create a new Page" placement="right-start">
                            <Button variant="outline" className="border border-[#475569] bg-[#212121] hover:bg-[#312f2f]" onClick={handleCreateLibrary}>
                                <Plus className="h-3 w-3" />
                            </Button>
                        </Tooltip>
                    )}
                </div>

                <div className="mt-1">
                    {loadingDiaries ? (
                        !isCollapsed &&
                        Array.from({ length: 5 }, (_, index) => <ShimmerEffect key={index} />)  // Shimmer Loading
                    ) : diaryEntries.length > 0 ? (
                        diaryEntries.map((entry) => (
                            <SidebarEntry
                                key={entry.id}
                                entry={entry}
                                isCollapsed={isCollapsed}
                                activeEntryId={activeEntryId}
                                onClick={() => handleEntryClick(entry)}
                                onDelete={() => handleDeleteDiary(token, entry.id)} />
                        ))
                    ) : (
                        <div className="flex p-5">No libraries found</div>
                    )}
                </div>
            </div>

            {/* User Section */}
            <UserSection user={user} isCollapsed={isCollapsed} handleLogout={handleLogout} />
        </div>
    );
};

const SidebarLink = (
    {
        href,
        icon: Icon,
        label,
        isCollapsed }:
        {
            href: string,
            icon: React.FC<LucideProps>,
            label: string,
            isCollapsed: boolean
        }) => (

    <Link href={href} className="flex items-center px-4 py-2 hover:bg-[#312f2f] transition-colors">
        <Icon className="h-4 w-4 mr-2" />
        {!isCollapsed && <span>{label}</span>}
    </Link>
);

const SidebarEntry = (
    { entry,
        isCollapsed,
        activeEntryId,
        onClick,
        onDelete }:
        {
            entry: Library,
            isCollapsed: boolean,
            activeEntryId: string | null,
            onClick: React.MouseEventHandler<HTMLDivElement>,
            onDelete: React.MouseEventHandler<HTMLDivElement> | undefined
        }) => (
    <div
        onClick={ onClick}
        className={`flex items-center px-3 py-1 rounded cursor-pointer transition-colors ${activeEntryId === entry.id ? "bg-[#312f2f] text-white" : "hover:bg-[#312f2f]"
            }`}
    >
        {!isCollapsed ? (
            <div className="flex items-center justify-between w-full group">
                <div className="flex items-center gap-2 overflow-hidden">
                    {entry.icon && <div className="mr-2">{entry.icon}</div>}
                    <span className="text-sm truncate flex-grow">{entry.title}</span>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button className="bg-transparent hover:bg-transparent">
                            <MoreHorizontalIcon className="h-2 w-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuGroup>
                            <DropdownMenuItem >
                                <PencilLine />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={onDelete}>
                                <Trash2 />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        ) : (
            <div className="mx-auto">{entry.icon || null}</div>
        )}
    </div>
);


const UserSection = ({ user, isCollapsed, handleLogout }: { user: User, isCollapsed: boolean, handleLogout: React.MouseEventHandler<HTMLDivElement> }) => (
    <div className="p-4 border-t border-[#3b3a3a] flex items-center justify-center gap-2">
        <Avatar>
            <AvatarImage src='avatar.com' />
            <AvatarFallback className="bg-purple-400 text-white">{getInitials(user?.name)}</AvatarFallback>
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
                <DropdownMenuContent className="w-20">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuGroup>
                        <DropdownMenuItem>
                            Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            Settings
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
);

export default Sidebar;
